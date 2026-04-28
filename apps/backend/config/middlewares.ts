import csp from "./csp";

const parseEnvList = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toOrigin = (value?: string) => {
  const raw = value?.trim();
  if (!raw) return undefined;

  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
};

const isProduction = process.env.NODE_ENV === "production";
const corsAllowedOrigins = Array.from(
  new Set([
    ...parseEnvList(process.env.CORS_ALLOWED_ORIGINS),
    ...(toOrigin(process.env.SSH_SERVER_HOST)
      ? [toOrigin(process.env.SSH_SERVER_HOST) as string]
      : [])
  ])
);

export default [
  "strapi::logger",
  "strapi::errors",
  { resolve: "./src/middlewares/upload-error-handler" },
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: csp,
      hsts: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }
    }
  },
  {
    name: "strapi::cors",
    config: {
      origin: corsAllowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"]
    }
  },
  { name: "strapi::poweredBy", config: { poweredBy: "Datha+" } },
  "strapi::query",
  "strapi::body",
  {
    name: "strapi::session",
    config: {
      key: "strapi.sid",
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax"
    }
  },
  { resolve: "./src/middlewares/admin-cors" },
  "strapi::favicon",
  "strapi::public",
  { resolve: "./src/middlewares/custom-cache-control" },
  { resolve: "./src/middlewares/custom-validation-cors" }
];
