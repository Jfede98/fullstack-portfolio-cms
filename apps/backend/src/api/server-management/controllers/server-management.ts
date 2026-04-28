import { Context } from 'koa';

export default ({ strapi }) => ({
  async reload(ctx: Context) {
    const { authorization } = ctx.request.headers;
    const expectedToken = process.env.SYNC_DEST_AUTH_TOKEN;

    if (!expectedToken) {
      strapi.log.error('[server-management] SYNC_DEST_AUTH_TOKEN is not defined in .env');
      return ctx.internalServerError('Server configuration error');
    }

    if (!authorization || authorization !== `Bearer ${expectedToken}`) {
      return ctx.unauthorized('Invalid or missing token');
    }

    try {
      strapi.log.info('[server-management] Triggering PM2 reload...');
      const result = await strapi.service('api::server-management.server-management').reload();
      
      ctx.send({
        message: 'Reload triggered successfully',
        details: result
      });
    } catch (err: any) {
      strapi.log.error(`[server-management] Reload failed: ${err.error || err.message}`);
      ctx.internalServerError('Failed to trigger reload', err);
    }
  },
});
