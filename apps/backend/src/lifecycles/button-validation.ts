import type { Core } from "@strapi/strapi";

const BUTTON_COMPONENT_UID = "global.button";

const ERROR_MESSAGE =
  "El campo 'Lead Form' es obligatorio cuando el identificador del botón es 'modal'. No es posible guardar ni publicar sin completarlo.";

function createValidationError(message: string): Error {
  const error = new Error(message);
  error.name = "ValidationError";
  (error as unknown as Record<string, unknown>).status = 400;
  (error as unknown as Record<string, unknown>).details = {};
  return error;
}

type RelationStatus = "filled" | "empty" | "unchanged";

function getRelationStatus(value: unknown): RelationStatus {
  if (value === null || value === undefined) return "empty";
  if (typeof value === "number") return value > 0 ? "filled" : "empty";
  if (typeof value === "string") return value.length > 0 ? "filled" : "empty";

  if (typeof value === "object") {
    const rel = value as Record<string, unknown>;

    if ("set" in rel) {
      return Array.isArray(rel.set) && rel.set.length > 0 ? "filled" : "empty";
    }

    if ("connect" in rel || "disconnect" in rel) {
      const connect = Array.isArray(rel.connect) ? rel.connect : [];
      const disconnect = Array.isArray(rel.disconnect) ? rel.disconnect : [];

      if (connect.length > 0) return "filled";
      if (disconnect.length > 0) return "empty";
      return "unchanged";
    }

    if ("id" in rel) return rel.id ? "filled" : "empty";
  }

  return "empty";
}

async function queryExisting(strapi: Core.Strapi, where: object) {
  return strapi.db.query(BUTTON_COMPONENT_UID).findOne({
    where,
    populate: { lead_form: true }
  });
}

export const registerButtonValidationLifecycle = (strapi: Core.Strapi) => {
  strapi.db.lifecycles.subscribe({
    models: [BUTTON_COMPONENT_UID],

    async beforeCreate(event) {
      const { data } = event.params;

      if (data.identifier !== "modal") return;

      const status = getRelationStatus(data.lead_form);

      if (status === "empty" || status === "unchanged") {
        throw createValidationError(ERROR_MESSAGE);
      }
    },

    async beforeUpdate(event) {
      const { data, where } = event.params;

      const identifierInData = "identifier" in data;
      const finalIdentifier = identifierInData
        ? data.identifier
        : (await queryExisting(strapi, where))?.identifier;

      if (finalIdentifier !== "modal") return;

      if (!("lead_form" in data)) {
        const existing = await queryExisting(strapi, where);
        if (!existing?.lead_form) throw createValidationError(ERROR_MESSAGE);
        return;
      }

      const status = getRelationStatus(data.lead_form);

      if (status === "filled") return;

      if (status === "empty") {
        throw createValidationError(ERROR_MESSAGE);
      }

      const existing = await queryExisting(strapi, where);
      if (!existing?.lead_form) {
        throw createValidationError(ERROR_MESSAGE);
      }
    }
  });
};

