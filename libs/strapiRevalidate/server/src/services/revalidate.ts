import type { Core } from '@strapi/strapi';

const normalizeFrontendUrl = (domain?: string) => {
  if (!domain) throw new Error('FRONTEND_DOMAIN is not set');
  return domain.replace(/\/$/, '');
};

const revalidate = async (
  strapi: Core.Strapi,
  providedTags: string[] = [],
  env: 'stg' | 'prod' = 'stg'
) => {
  const settings = await strapi.plugin('strapi-revalidate').service('settings').getSettings();

  const domain =
    env === 'prod'
      ? settings.frontendProdUrl || process.env.FRONTEND_PROD_DOMAIN
      : settings.frontendUrl || process.env.FRONTEND_DOMAIN;

  const authToken =
    env === 'prod'
      ? settings.authProdToken || process.env.FRONTEND_PROD_AUTH_TOKEN
      : settings.authToken;

  const target = normalizeFrontendUrl(domain);
  const timeoutMs = Number(process.env.REVALIDATE_TIMEOUT_MS || 10000);

  const defaultTagsEnv = process.env.DEFAULT_REVALIDATE_TAGS || '';
  const defaultTags = defaultTagsEnv
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const tags = Array.from(new Set([...defaultTags, ...providedTags]));

  const controller = new AbortController();
  const startedAt = Date.now();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  strapi.log.info(
    `[revalidate] Iniciando petición a: ${target}/api/revalidate ${tags.length ? `con tags: ${tags.join(', ')}` : ''}`
  );

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!authToken) throw new Error('No se ha configurado un token de autorización');

    headers['Authorization'] = `Bearer ${authToken}`;

    const opts = {
      method: 'POST',
      headers,
      body: JSON.stringify({ tags }),
      signal: controller.signal,
    };

    strapi.log.info(
      `[revalidate] Iniciando petición a: ${target}/api/revalidate ${tags.length ? `con tags: ${tags.join(', ')}` : ''}`
    );
    strapi.log.debug(`[revalidate] Opciones: ${JSON.stringify(opts)}`);

    const response = await fetch(`${target}/api/revalidate`, opts);

    const durationMs = Date.now() - startedAt;
    const result = {
      status: response.status,
      ok: response.ok,
      target: `${target}/api/revalidate`,
      tags,
      durationMs,
    };

    if (!response.ok) {
      strapi.log.warn(
        `[revalidate] Frontend respondió con error ${response.status} en ${durationMs}ms`
      );
      return {
        ...result,
        message: `Frontend responded with ${response.status}`,
      };
    }

    if (env === 'prod') {
      const reloadToken = process.env.SYNC_DEST_AUTH_TOKEN;
      if (reloadToken) {
        strapi.log.info(
          `[revalidate] Solicitando recarga de servidor en PROD: ${target}/api/server-management/reload`
        );
        fetch(`${target}/api/server-management/reload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${reloadToken}`,
          },
        }).catch((err) => {
          strapi.log.error(`[revalidate] Error al solicitar recarga de servidor: ${err.message}`);
        });
      } else {
        strapi.log.warn(
          '[revalidate] No se encontró SYNC_DEST_AUTH_TOKEN para la recarga de servidor'
        );
      }
    }

    strapi.log.info(`[revalidate] Éxito: ${response.status} en ${durationMs}ms`);

    return { ...result, message: 'Success' };
  } catch (error: any) {
    const durationMs = Date.now() - startedAt;
    const isAbort = error?.name === 'AbortError';
    const message = isAbort ? `Timeout after ${timeoutMs}ms` : error?.message || 'Unknown error';

    strapi.log.error(`[revalidate] Falló después de ${durationMs}ms: ${message}`);
    if (!isAbort) strapi.log.debug(error);

    return {
      status: isAbort ? 408 : 500,
      ok: false,
      target: `${target}/api/revalidate`,
      tags,
      durationMs,
      message,
    };
  } finally {
    clearTimeout(timeoutId);
  }
};

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  async revalidate(tags: string[] = [], env: 'stg' | 'prod' = 'stg') {
    return await revalidate(strapi, tags, env);
  },
});

export default service;
