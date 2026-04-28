import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings() {
    const store = strapi.store({ type: 'plugin', name: 'strapi-revalidate' });
    const settings = (await store.get({ key: 'settings' })) as Record<string, any> | null;

    const defaultSettings = {
      frontendUrl: process.env.FRONTEND_DOMAIN || '',
      authToken: process.env.FRONTEND_AUTH_TOKEN || '',
      frontendProdUrl: process.env.FRONTEND_PROD_DOMAIN || '',
      authProdToken: process.env.FRONTEND_PROD_AUTH_TOKEN || '',
    };

    if (!settings) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...settings,
    };
  },

  async setSettings(settings: any) {
    const store = strapi.store({ type: 'plugin', name: 'strapi-revalidate' });
    await store.set({ key: 'settings', value: settings });
    return settings;
  },
});
