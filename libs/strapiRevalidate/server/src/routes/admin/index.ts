export default () => ({
  type: 'admin',
  routes: [
    {
      method: 'POST',
      path: '/revalidate',
      handler: 'revalidate.revalidate',
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
  ],
});
