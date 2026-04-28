import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings(ctx: any) {
    try {
      const settings = await strapi.plugin('strapi-backups').service('settings').getSettings();
      ctx.body = { data: settings };
    } catch (error: any) {
      ctx.internalServerError(error.message);
    }
  },

  async setSettings(ctx: any) {
    try {
      const { data } = ctx.request.body;
      if (!data) {
        return ctx.badRequest('No data provided');
      }
      const settings = await strapi.plugin('strapi-backups').service('settings').setSettings(data);
      ctx.body = { data: settings };
    } catch (error: any) {
      ctx.internalServerError(error.message);
    }
  },
});
