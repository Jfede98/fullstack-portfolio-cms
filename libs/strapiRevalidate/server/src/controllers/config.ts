import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getConfig(ctx: any) {
    try {
      const config = strapi.config.get('plugin::strapi-revalidate');
      ctx.body = {
        data: config,
      };
    } catch (error: any) {
      strapi.log.error('Error fetching plugin config:', error);
      ctx.throw(500, error.message);
    }
  },
});
