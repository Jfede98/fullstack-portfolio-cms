const uploadErrorHandler = () => async (ctx: any, next: any) => {
  await next();

  const isUploadEndpoint =
    ctx.request.path.startsWith("/upload") ||
    ctx.request.path.startsWith("/api/upload");
  const isPayloadTooLarge = ctx.status === 413;
  const currentMessage = ctx?.body?.error?.message ?? "";
  const matchesDefaultMessage =
    typeof currentMessage === "string" &&
    currentMessage?.includes("exceeds size limit");

  if (isUploadEndpoint && isPayloadTooLarge && matchesDefaultMessage) {
    ctx.body = {
      data: null,
      error: {
        status: 413,
        name: "PayloadTooLargeError",
        message:
          "El archivo supera el límite de 1 MB. Optimiza el peso o usa formatos SVG/WEBP.",
        details: {}
      }
    };
  }
};

export default uploadErrorHandler;
