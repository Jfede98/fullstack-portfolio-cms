import { randomUUID } from 'crypto';

type TokenApiResponse = {
  code?: number;
  message?: string;
  expiryTime?: number;
  token?: string;
  access_token?: string;
  accessToken?: string;
  data?: {
    expiryTime?: number;
    token?: string;
    access_token?: string;
    accessToken?: string;
  };
};

type RemoteCity = {
  id: number;
  name: string;
  state?: string;
};

type CitiesApiResponse = {
  data?: RemoteCity[];
  cities?: RemoteCity[];
  response?: {
    data?: RemoteCity[];
    cities?: RemoteCity[];
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
};

const looksLikeCity = (value: unknown): value is RemoteCity => {
  return isRecord(value) && typeof value.name === 'string';
};

const findCitiesArray = (value: unknown, depth = 0): RemoteCity[] => {
  if (depth > 6 || value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    if (value.every((item) => looksLikeCity(item))) {
      return value as RemoteCity[];
    }

    for (const item of value) {
      const nested = findCitiesArray(item, depth + 1);
      if (nested.length > 0) {
        return nested;
      }
    }
    return [];
  }

  if (!isRecord(value)) {
    return [];
  }

  for (const nestedValue of Object.values(value)) {
    const nested = findCitiesArray(nestedValue, depth + 1);
    if (nested.length > 0) {
      return nested;
    }
  }

  return [];
};

const TOKEN_PATH = '/rest/token-api/v1.0/generate';
const CITIES_PATH = '/rest/address-catalog-api/v1.0/get/cities';

const CHANNEL = process.env.APIX_CHANNEL;
const REALM = process.env.APIX_REALM;
const TYPE = process.env.APIX_TYPE;
const BASE_URL = process.env.APIX_BASE_URL;
const API_KEY = process.env.APIX_KEY;

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

const requiredAddressCatalogEnv: Record<string, string | undefined> = {
  APIX_CHANNEL: CHANNEL,
  APIX_REALM: REALM,
  APIX_TYPE: TYPE,
  APIX_BASE_URL: BASE_URL,
  APIX_KEY: API_KEY
};

const ensureAddressCatalogEnv = (): void => {
  for (const [name, value] of Object.entries(requiredAddressCatalogEnv)) {
    if (!value?.trim()) {
      throw new Error(
        `Missing required environment variable "${name}" for address-catalog service`
      );
    }
  }
};

const normalizeCityName = (value: string): string => {
  return value
    .trim()
    .toLocaleLowerCase('es-EC')
    .replace(/\b\p{L}/gu, (char) => char.toLocaleUpperCase('es-EC'));
};

const isActiveCity = (city: RemoteCity): boolean => {
  return city.state?.trim().toUpperCase() === 'ACTIVADO';
};

const parseTokenFromResponse = (payload: TokenApiResponse): string | null => {
  return (
    payload?.token ??
    payload?.access_token ??
    payload?.accessToken ??
    payload?.data?.token ??
    payload?.data?.access_token ??
    payload?.data?.accessToken ??
    null
  );
};

const parseExpiryMsFromResponse = (payload: TokenApiResponse): number | null => {
  const expirySeconds = payload?.data?.expiryTime ?? payload?.expiryTime;

  if (typeof expirySeconds !== 'number' || !Number.isFinite(expirySeconds) || expirySeconds <= 0) {
    return null;
  }

  return expirySeconds * 1000;
};

const decodeJwtExpiration = (token: string): number | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const payloadJson = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number };
    return payloadJson.exp ? payloadJson.exp * 1000 : null;
  } catch {
    return null;
  }
};

const getToken = async (): Promise<string> => {
  ensureAddressCatalogEnv();

  const now = Date.now();
  if (cachedToken && cachedTokenExpiresAt > now) {
    return cachedToken;
  }

  const response = await fetch(`${BASE_URL}${TOKEN_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: CHANNEL,
      key: API_KEY,
      realm: REALM,
      type: TYPE,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token API request failed with ${response.status}: ${body}`);
  }

  const payload = (await response.json()) as TokenApiResponse;
  if (typeof payload?.code === 'number' && payload.code !== 0) {
    throw new Error(`Token API returned code ${payload.code}${payload.message ? `: ${payload.message}` : ''}`);
  }

  const token = parseTokenFromResponse(payload);

  if (!token) {
    throw new Error('Token API response did not include a token.');
  }

  cachedToken = token;
  const expiryMs = parseExpiryMsFromResponse(payload);
  const tokenExp = decodeJwtExpiration(token);
  cachedTokenExpiresAt = expiryMs
    ? Date.now() + Math.max(expiryMs - 30_000, 30_000)
    : tokenExp
      ? tokenExp - 30_000
      : Date.now() + 10 * 60_000;

  return token;
};

export default () => ({
  async getActiveCities() {
    ensureAddressCatalogEnv();
    const token = await getToken();

    const response = await fetch(`${BASE_URL}${CITIES_PATH}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        channel: CHANNEL,
        externalTransactionId: randomUUID(),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Cities API request failed with ${response.status}: ${body}`);
    }

    const payload = (await response.json()) as CitiesApiResponse | RemoteCity[] | Record<string, unknown>;
    const cities = findCitiesArray(payload);

    const cityNames = cities
      .filter(isActiveCity)
      .map((city) => normalizeCityName(city.name))
      .filter(Boolean);

    return [...new Set(cityNames)].sort((a, b) => a.localeCompare(b, 'es-EC'));
  },
});
