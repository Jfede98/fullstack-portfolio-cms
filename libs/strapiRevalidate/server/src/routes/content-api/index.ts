export default () => ({
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'baseController.index',
      config: {
        policies: [],
      },
    },
  ],
});
