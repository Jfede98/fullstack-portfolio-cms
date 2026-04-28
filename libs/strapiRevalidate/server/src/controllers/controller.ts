import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin('strapi-revalidate').service('revalidate').revalidate();
  },
});

export default controller;
