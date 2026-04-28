import type { Core } from "@strapi/strapi";
import { syncCspToStaticStorage } from "../utils/csp-sync";

export const CSP_MODEL_UID = "api::content-security-policy.content-security-policy";

type TCspEntity = {
  csp?: unknown;
  publishedAt?: string | null;
};

const syncIfPublished = async (strapi: Core.Strapi, entity?: TCspEntity | null) => {
  if (!entity?.publishedAt || !entity.csp) return;
  await syncCspToStaticStorage(strapi, entity.csp);
};

export const registerCspSyncLifecycle = async (strapi: Core.Strapi) => {
  strapi.db.lifecycles.subscribe({
    models: [CSP_MODEL_UID],

    async afterCreate(event) {
      await syncIfPublished(strapi, event.result as TCspEntity);
    },

    async afterUpdate(event) {
      await syncIfPublished(strapi, event.result as TCspEntity);
    }
  });

  try {
    const currentCsp = (await strapi.db.query(CSP_MODEL_UID).findOne({
      where: {
        publishedAt: {
          $notNull: true
        }
      },
      select: ["csp", "publishedAt"],
      orderBy: { updatedAt: "desc" }
    })) as TCspEntity | null;

    await syncIfPublished(strapi, currentCsp);
  } catch (error) {
    strapi.log.warn("[csp-sync] No se pudo sincronizar CSP al iniciar", error);
  }
};
