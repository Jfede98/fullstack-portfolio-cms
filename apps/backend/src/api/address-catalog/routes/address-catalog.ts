export default {
  routes: [
    {
      method: 'GET',
      path: '/address-catalog/cities',
      handler: 'address-catalog.cities',
      config: {
        auth: false,
      },
    },
  ],
};
