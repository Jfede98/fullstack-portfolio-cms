/**
 * semiautomatic-flow controller
 */

import { factories } from '@strapi/strapi';
import { SEMIAUTOMATIC_FLOW_POPULATE } from '../constants/populate';

const SEMIAUTOMATIC_FLOW_UID = 'api::semiautomatic-flow.semiautomatic-flow';

type TFindSemiautomaticFlowQuery = {
  locale?: string;
};

export default factories.createCoreController(SEMIAUTOMATIC_FLOW_UID, ({ strapi }) => ({
  async find(ctx) {
    const query = (ctx.query ?? {}) as TFindSemiautomaticFlowQuery;
    const locale = typeof query.locale === 'string' ? query.locale : undefined;

    const flow = await strapi.documents(SEMIAUTOMATIC_FLOW_UID).findFirst({
      status: 'published',
      locale,
      populate: SEMIAUTOMATIC_FLOW_POPULATE as any,
    });

    if (!flow) {
      return ctx.notFound('No se encontró semiautomatic-flow');
    }

    ctx.body = {
      data: flow,
      meta: {},
    };
  },
}));
