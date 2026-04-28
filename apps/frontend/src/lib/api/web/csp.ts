"use server";

import { fetchAdminToken } from "@lib/fetch";
import { RevalidateTags } from "@lib/constants/state";

export type ContentSecurityPolicy = Record<string, string[]>;

type CspResponsePayload = {
  csp?: unknown;
  data?: {
    csp?: unknown;
  };
};

class CspConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CspConfigurationError";
  }
}

class CspFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CspFetchError";
  }
}

const CSP_FILE_NAME = "csp.json";
const STATIC_FAILURE_COOLDOWN_MS = 60_000;

let lastReportedCspSource: "static" | "strapi" | null = null;
let skipStaticUntil = 0;

const reportCspSource = (source: "static" | "strapi", detail: string): void => {
  if (lastReportedCspSource === source) return;
  lastReportedCspSource = source;
  console.log(`[CSP] Source: ${source} (${detail})`);
};

const markStaticFailure = (): void => {
  skipStaticUntil = Date.now() + STATIC_FAILURE_COOLDOWN_MS;
};

const shouldSkipStatic = (): boolean => Date.now() < skipStaticUntil;

const sanitizeEnv = (value: string | undefined): string | null => {
  if (!value) return null;
  const clean = value.trim().replace(/^"(.*)"$/, "$1");
  return clean.length > 0 ? clean : null;
};

const normalizeHttpBaseUrl = (value: string): string =>
  /^https?:\/\//i.test(value) ? value : `https://${value}`;

const trimTrailingSlash = (value: string): string => value.replace(/\/$/, "");

const trimPathSlashes = (value: string): string =>
  value
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

const resolveCspObjectPath = (): string => {
  const rootPath = sanitizeEnv(process.env.AWS_S3_ROOT_PATH);
  if (!rootPath) {
    throw new CspConfigurationError("CSP path is not configured. Set AWS_S3_ROOT_PATH.");
  }

  return rootPath + "/" + CSP_FILE_NAME;
};

const buildStaticCspUrl = (): string => {
  const staticBaseUrl = sanitizeEnv(process.env.URL_STATIC_RESOURCES);

  if (!staticBaseUrl) {
    throw new CspConfigurationError(
      "CSP static source is not configured. Set URL_STATIC_RESOURCES."
    );
  }

  const objectPath = trimPathSlashes(resolveCspObjectPath());
  if (!objectPath) {
    throw new CspConfigurationError("CSP object path is empty after normalization.");
  }

  const normalizedBaseUrl = trimTrailingSlash(normalizeHttpBaseUrl(staticBaseUrl));
  return `${normalizedBaseUrl}/${objectPath}`;
};

const isDirectiveValues = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.every((entry) => typeof entry === "string" && entry.trim().length > 0);

const normalizeCspPayload = (payload: unknown): ContentSecurityPolicy => {
  if (!payload || typeof payload !== "object") {
    throw new CspFetchError("Invalid CSP payload: expected an object.");
  }

  const entries = Object.entries(payload as Record<string, unknown>).filter(([, value]) =>
    isDirectiveValues(value)
  ) as [string, string[]][];

  if (entries.length === 0) {
    throw new CspFetchError("Invalid CSP payload: no valid directives found.");
  }

  return Object.fromEntries(entries);
};

const parsePayloadFromUnknown = (raw: unknown): ContentSecurityPolicy => {
  const parsed = raw as CspResponsePayload;
  return normalizeCspPayload(parsed?.data?.csp ?? parsed?.csp ?? raw);
};

const fetchCspFromStaticSource = async (): Promise<ContentSecurityPolicy | null> => {
  if (shouldSkipStatic()) return null;

  try {
    const cspUrl = buildStaticCspUrl();
    const response = await fetch(cspUrl, {
      cache: "force-cache",
      next: {
        revalidate: 0,
        tags: [RevalidateTags.CSP, RevalidateTags.ALL]
      }
    });

    if (!response.ok) {
      throw new CspFetchError(
        `Failed to fetch CSP from static source: HTTP ${response.status}.`
      );
    }

    const raw = (await response.json()) as unknown;
    const csp = parsePayloadFromUnknown(raw);

    skipStaticUntil = 0;
    reportCspSource("static", cspUrl);
    return csp;
  } catch (error) {
    markStaticFailure();
    console.warn("[CSP] Static source failed, using Strapi fallback.", error);
    return null;
  }
};

const fetchCspFromStrapi = async (): Promise<ContentSecurityPolicy> => {
  const response = await fetchAdminToken<CspResponsePayload>("api/content-security-policy", {
    next: {
      revalidate: 0,
      tags: [RevalidateTags.CSP]
    }
  });

  const csp = parsePayloadFromUnknown(response);
  reportCspSource("strapi", "fallback");
  return csp;
};

export const getContentSecurityPolicy = async (): Promise<ContentSecurityPolicy> => {
  const cspFromStatic = await fetchCspFromStaticSource();
  if (cspFromStatic) return cspFromStatic;
  return fetchCspFromStrapi();
};
