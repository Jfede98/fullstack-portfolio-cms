import type { TGtmEvent } from "@interfaces/lib/gtm";

export const STRAPI_BASE_URL = process.env.STRAPI_API_URL!;
export const STRAPI_ORIGIN_HEADER = process.env.STRAPI_ORIGIN_HEADER!;
export const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID!;
export const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN;
export const URL_STATIC_RESOURCES = process.env.URL_STATIC_RESOURCES;
export const SITE_ORIGIN = process.env.SITE_ORIGIN!;
export const TOM_GESTOR_LEADS_OAUTH_URL = process.env.TOM_GESTOR_LEADS_OAUTH_URL;
export const TOM_GESTOR_LEADS_CLIENT_ID = process.env.TOM_GESTOR_LEADS_CLIENT_ID;
export const TOM_GESTOR_LEADS_CLIENT_SECRET = process.env.TOM_GESTOR_LEADS_CLIENT_SECRET;
export const SITEMAP_BASE_URL =
  process.env.SST_DOMAIN ?? process.env.SITE_ORIGIN;

export const STAGE = process.env.NODE_ENV ?? "development";
export const SST_STAGE = process.env.SST_STAGE ?? "stg";
export const TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE = "client_credentials";
export const HOME_POPULATE_LEVEL = 7;
export const NO_COVERAGE_REDIRECT = "/";

export const REVALIDATE_API = 262800;
export const REVALIDATE_MENU_API = 262800;
export const SITEMAP_REVALIDATE_API = 262800;

export const DEFAULT_GTM_EVENT: TGtmEvent = {
  event: "",
  flow: "",
  section: "",
  elementDescription: "",
  em: "",
  ph: "",
  fn: "",
  ln: "",
  ct: "",
  country: "",
  idTransaction: ""
};
