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

const ALLOWED_DOMAINS = Array.from(
  new Set([
    ...parseEnvList(process.env.CORS_ALLOWED_ORIGINS),
    ...(toOrigin(process.env.SSH_SERVER_HOST)
      ? [toOrigin(process.env.SSH_SERVER_HOST) as string]
      : [])
  ])
);

const toRegex = (pattern: string) => {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^(https?:\\/\\/)?${escaped}(?::\\d+)?$`, "i");
};

export default () => {
  const allowedRegex = ALLOWED_DOMAINS.map(toRegex);

  return async (ctx, next) => {
    const url = ctx.request.url;
    const origin = ctx.request.headers.origin;

    if (url?.includes("/api/revalidate/revalidate")) {
      await next();
      return;
    }

    if (url?.includes("/api/") && !origin) {
      ctx.status = 403;
      ctx.body = { message: "Add Origin to Headers" };
      ctx.remove("Access-Control-Allow-Origin");
      ctx.remove("Access-Control-Allow-Credentials");
      return;
    }

    if (url?.includes("/api/") && origin) {
      const normalizedOrigin = origin.replace(/https?:\/\//, "");
      const isAllowed = allowedRegex.some(
        (regex) => regex.test(origin) || regex.test(normalizedOrigin)
      );

      if (isAllowed) {
        ctx.set("Access-Control-Allow-Origin", origin);
        ctx.set("Access-Control-Allow-Credentials", "true");
      } else {
        ctx.status = 403;
        ctx.body = {
          message: "Access denied by CORS policy: The origin is not allowed."
        };
        ctx.remove("Access-Control-Allow-Origin");
        ctx.remove("Access-Control-Allow-Credentials");
        return;
      }
    }

    await next();
  };
};
