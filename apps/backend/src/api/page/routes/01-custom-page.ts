export default {
  routes: [
    {
      method: 'GET',
      path: '/pages/by-slug',
      handler: 'page.findBySlug',
    },
    {
      method: 'GET',
      path: '/pages/sitemap',
      handler: 'page.sitemap',
    },
  ],
};
