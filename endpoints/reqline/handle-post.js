const { createHandler } = require('@app-core/server');
const parseReqlineService = require('../../services/reqline/parse-service');

module.exports = createHandler({
  path: '/',
  method: 'post',
  async handler(rc, helpers) {
    try {
      const { reqline } = rc.body;

      if (typeof reqline !== 'string') {
        return {
          status: helpers.http_statuses.HTTP_400_BAD_REQUEST,
          data: {
            error: true,
            message: 'Missing reqline in request body',
          },
        };
      }

      const result = await parseReqlineService(reqline);

      return {
        status: result.error
          ? helpers.http_statuses.HTTP_400_BAD_REQUEST
          : helpers.http_statuses.HTTP_200_OK,
        data: result,
      };
    } catch (err) {
      console.error('Caught in handler:', err);
      return {
        status: 400,
        data: {
          error: true,
          message: err.message,
        },
      };
    }
  },
});
