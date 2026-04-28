/**
 * page controller
 */

import { factories } from '@strapi/strapi';
import { PAGE_POPULATE } from '../constants/populate';

const PAGE_MODEL_UID = 'api::page.page';

type TFindBySlugQuery = {
  slug?: string;
  locale?: string;
};

export default factories.createCoreController(PAGE_MODEL_UID, ({ strapi }) => ({
  async sitemap(ctx) {
    try {
      const entries = await strapi.documents(PAGE_MODEL_UID).findMany({
        status: 'published',
        fields: ['slug', 'name', 'updatedAt'],
        // Límite máximo estándar para un archivo sitemap
        limit: 50000,
        sort: 'updatedAt:desc',
      });

      ctx.body = entries;
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  },
  async findBySlug(ctx) {
    const query = (ctx.query ?? {}) as TFindBySlugQuery;
    const slug = String(query.slug ?? '').trim();
    const locale = typeof query.locale === 'string' ? query.locale : undefined;

    if (!slug) {
      return ctx.badRequest('slug es requerido');
    }

    const page = await strapi.documents(PAGE_MODEL_UID).findFirst({
      status: 'published',
      filters: { slug: { $eq: slug } },
      locale,
      populate: PAGE_POPULATE,
    });

    if (!page) {
      return ctx.notFound(`No se encontró page para slug [${slug}]`);
    }

    ctx.body = {
      data: page,
      meta: {},
    };
  },
}));
