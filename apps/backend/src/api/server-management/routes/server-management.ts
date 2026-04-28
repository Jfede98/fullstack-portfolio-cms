export default {
  routes: [
    {
      method: 'POST',
      path: '/server-management/reload',
      handler: 'server-management.reload',
      config: {
        policies: [],
        auth: false, // Protected via custom Bearer token in controller
      },
    },
  ],
};
