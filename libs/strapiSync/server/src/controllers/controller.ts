import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-sync')
      // the name of the service file & the method.
      .service('service')
      .sync();
  },
});

export default controller;
