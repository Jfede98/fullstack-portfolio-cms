import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings() {
    const store = strapi.store({ type: 'plugin', name: 'strapi-backups' });
    const settings = (await store.get({ key: 'settings' })) as Record<string, any> | null;

    const defaultSettings = {
      s3Bucket: process.env.STRAPI_BACKUP_S3_BUCKET || 'statics-xtrim-sitio-publico',
      s3Path: process.env.STRAPI_BACKUP_S3_PATH || 'backups',
    };

    if (!settings) {
      return defaultSettings;
    }

    return {
      s3Bucket: settings.s3Bucket || defaultSettings.s3Bucket,
      s3Path: settings.s3Path || defaultSettings.s3Path,
    };
  },

  async setSettings(settings: any) {
    const store = strapi.store({ type: 'plugin', name: 'strapi-backups' });
    await store.set({ key: 'settings', value: settings });
    return settings;
  },
});
