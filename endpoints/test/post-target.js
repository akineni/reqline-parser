const { createHandler } = require('@app-core/server');

module.exports = createHandler({
  path: '/test-post',
  method: 'post',
  async handler(rc, helpers) {
    try {
      const { body, query, headers } = rc;

      return {
        status: helpers.http_statuses.HTTP_200_OK,
        data: {
          message: 'Test POST endpoint received your request!',
          received_body: body,
          received_query: query,
          received_headers: headers,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (err) {
      console.error('Caught in handler:', err);
    }
  },
});
