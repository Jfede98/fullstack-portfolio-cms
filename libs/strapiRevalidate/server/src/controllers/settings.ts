import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: any) {
    try {
      const settings = await strapi.plugin('strapi-revalidate').service('settings').getSettings();
      ctx.body = { data: settings };
    } catch (error: any) {
      strapi.log.error('Error fetching settings:', error);
      ctx.throw(500, error.message);
    }
  },

  async updateSettings(ctx: any) {
    try {
      const { body } = ctx.request;
      const settings = await strapi
        .plugin('strapi-revalidate')
        .service('settings')
        .setSettings(body);
      ctx.body = { data: settings };
    } catch (error: any) {
      strapi.log.error('Error updating settings:', error);
      ctx.throw(500, error.message);
    }
  },
});
