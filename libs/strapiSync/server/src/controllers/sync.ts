import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async sync(ctx: any) {
    try {
      await strapi.plugin('strapi-sync').service('sync').sync();
      ctx.body = {
        message: 'Sincronización completada con éxito',
        ok: true,
      };
    } catch (error: any) {
      strapi.log.error('Error en el controlador de sync:', error);
      ctx.throw(500, error.message);
    }
  },
});
