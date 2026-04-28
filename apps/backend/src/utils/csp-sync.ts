import { Readable } from "node:stream";
import type { Core } from "@strapi/strapi";

const STATIC_CSP_FILE_NAME = "csp.json";

type TCspMap = Record<string, string[]>;

type TUploadFile = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  buffer: Buffer;
  stream: Readable;
  url?: string;
};

type TUploadProvider = {
  upload: (
    file: TUploadFile,
    customParams?: Record<string, string>
  ) => Promise<void>;
};

const isValidCsp = (value: unknown): value is TCspMap =>
  !!value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.values(value).every(
    (directive) =>
      Array.isArray(directive) &&
      directive.every((entry) => typeof entry === "string")
  );

const getUploadProvider = (strapi: Core.Strapi): TUploadProvider | null => {
  const provider = (
    strapi.plugin("upload") as unknown as { provider?: unknown }
  )?.provider;
  if (!provider || typeof (provider as TUploadProvider).upload !== "function") {
    return null;
  }
  return provider as TUploadProvider;
};

export const syncCspToStaticStorage = async (
  strapi: Core.Strapi,
  csp: unknown
): Promise<void> => {
  if (!isValidCsp(csp)) {
    strapi.log.warn("[csp-sync] CSP inválido, se omite sincronización");
    return;
  }

  const provider = getUploadProvider(strapi);
  if (!provider) {
    strapi.log.warn("[csp-sync] Upload provider no disponible");
    return;
  }

  const rawPayload = JSON.stringify({
    csp,
    updatedAt: new Date().toISOString()
  });
  const payload = Buffer.from(rawPayload, "utf8");

  const file: TUploadFile = {
    name: STATIC_CSP_FILE_NAME,
    hash: "csp",
    ext: ".json",
    mime: "application/json",
    size: payload.length,
    buffer: payload,
    stream: Readable.from(payload)
  };

  try {
    await provider.upload(file, {
      ContentType: "application/json"
    });
    strapi.log.info(`[csp-sync] CSP sincronizado en ${file.url}`);
  } catch (error) {
    strapi.log.warn(
      "[csp-sync] No se pudo subir el CSP al almacenamiento estático",
      error
    );
  }
};
