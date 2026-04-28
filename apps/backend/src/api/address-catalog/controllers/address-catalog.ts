export default {
  async cities(ctx) {
    try {
      const data = await strapi
        .service('api::address-catalog.address-catalog')
        .getActiveCities();

      ctx.body = {
        data,
      };
    } catch (error) {
      strapi.log.error('[address-catalog] Error fetching cities', error);
      ctx.status = 500;
      ctx.body = {
        error: 'No se pudieron obtener las ciudades.',
      };
    }
  },
};
