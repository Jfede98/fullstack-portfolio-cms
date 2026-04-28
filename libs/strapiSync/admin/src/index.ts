import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { SyncButtonCard } from './components/card';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    const contentManager = app.getPlugin('content-manager');
    if (!contentManager?.apis?.addEditViewSidePanel) return;
    contentManager.apis.addEditViewSidePanel([SyncButtonCard]);

    app.createSettingSection(
      {
        id: PLUGIN_ID,
        intlLabel: {
          id: `${PLUGIN_ID}.plugin.name`,
          defaultMessage: 'Strapi Sync',
        },
      },
      [
        {
          intlLabel: {
            id: `${PLUGIN_ID}.settings.title`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `/settings/${PLUGIN_ID}`,
          Component: async () => {
            const { SettingsPage } = await import('./pages/Settings');
            return SettingsPage;
          },
        },
      ]
    );
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
