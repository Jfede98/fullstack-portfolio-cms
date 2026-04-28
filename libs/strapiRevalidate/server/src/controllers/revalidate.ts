import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async revalidate(ctx: any) {
    try {
      const { tags, env } = ctx.request.body || {};
      const result = await strapi
        .plugin('strapi-revalidate')
        .service('revalidate')
        .revalidate(tags, env);

      ctx.status = result.ok ? 200 : result.status || 500;
      ctx.body = {
        ...result,
        message: result.ok
          ? 'Revalidación completada con éxito'
          : `Error en revalidación: ${result.message}`,
      };
    } catch (error: any) {
      strapi.log.error('Error en el controlador de revalidate:', error);
      ctx.throw(500, error.message);
    }
  },
});
