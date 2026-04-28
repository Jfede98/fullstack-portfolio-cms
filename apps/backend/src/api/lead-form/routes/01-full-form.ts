export default {
  routes: [
    {
      method: 'GET',
      path: '/lead-forms/:documentId/full',
      handler: 'lead-form.getFullByDocumentId',
    },
  ],
};

