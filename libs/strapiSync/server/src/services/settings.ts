import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSettings() {
    const store = strapi.store({ type: 'plugin', name: 'strapi-sync' });
    const settings = (await store.get({ key: 'settings' })) as Record<string, any> | null;

    const defaultSettings = {
      destinationIp: process.env.SYNC_DESTINATION_IP || '',
      destinationEnv: process.env.SYNC_DESTINATION_ENV || '',
      sourceBucketPath: process.env.SYNC_SOURCE_BUCKET_PATH || '',
      destinationBucketPath: process.env.SYNC_DESTINATION_BUCKET_PATH || '',
      sourceCloudfrontPath: process.env.SYNC_SOURCE_CLOUDFRONT_PATH || '',
      destinationCloudfrontPath: process.env.SYNC_DESTINATION_CLOUDFRONT_PATH || '',
      isLocal: process.env.SYNC_IS_LOCAL === 'true',
    };

    if (!settings) {
      return defaultSettings;
    }

    return {
      destinationIp: settings.destinationIp || defaultSettings.destinationIp,
      destinationEnv: settings.destinationEnv || defaultSettings.destinationEnv,
      sourceBucketPath: settings.sourceBucketPath || defaultSettings.sourceBucketPath,
      destinationBucketPath:
        settings.destinationBucketPath || defaultSettings.destinationBucketPath,
      sourceCloudfrontPath: settings.sourceCloudfrontPath || defaultSettings.sourceCloudfrontPath,
      destinationCloudfrontPath:
        settings.destinationCloudfrontPath || defaultSettings.destinationCloudfrontPath,
      isLocal: settings.isLocal !== undefined ? settings.isLocal : defaultSettings.isLocal,
    };
  },

  async setSettings(settings: any) {
    const store = strapi.store({ type: 'plugin', name: 'strapi-sync' });
    await store.set({ key: 'settings', value: settings });
    return settings;
  },
});
