export default () => ({
  type: "admin",
  routes: [
    {
      method: 'GET',
      path: '/list',
      handler: 'controller.listBackups',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/create',
      handler: 'controller.createBackup',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/restore',
      handler: 'controller.restoreBackup',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/delete',
      handler: 'controller.deleteBackup',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'settings.getSettings',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'settings.setSettings',
      config: { policies: [] },
    },
  ],
});