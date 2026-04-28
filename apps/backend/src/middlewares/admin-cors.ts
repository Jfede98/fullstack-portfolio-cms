const toOrigin = (value?: string) => {
  const raw = value?.trim();
  if (!raw) return undefined;

  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
};

const adminOrigin = toOrigin(process.env.SSH_SERVER_HOST);

export default () => {
  return async (ctx, next) => {
    await next();

    const url = ctx.request.url;
    if (!url?.startsWith("/admin")) return;
    if (!adminOrigin) return;

    ctx.set("Access-Control-Allow-Origin", adminOrigin);
    ctx.set("Access-Control-Allow-Credentials", "true");
  };
};
