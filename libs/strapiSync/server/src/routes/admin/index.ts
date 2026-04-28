export default () => ({
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/sync',
      handler: 'sync.sync',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: {
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/settings',
      handler: 'settings.updateSettings',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/config',
      handler: 'config.getConfig',
      config: {
        auth: false,
      },
    },
  ],
});
