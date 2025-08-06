const axios = require('axios');
const { parseReqline } = require('@app-core/validator/parser/parse-reqline');

module.exports = async function parseReqlineService(reqline) {
  let parsed;
  try {
    parsed = parseReqline(reqline);
  } catch (err) {
    return { error: true, message: err.message };
  }

  let fullUrl;
  try {
    fullUrl = new URL(parsed.url);
    Object.entries(parsed.query).forEach(([key, value]) => {
      fullUrl.searchParams.append(key, String(value));
    });
  } catch {
    return { error: true, message: 'Invalid URL format' };
  }

  const requestStart = Date.now();
  try {
    const axiosResponse = await axios({
      method: parsed.method.toLowerCase(),
      url: fullUrl.toString(),
      headers: parsed.headers,
      data: parsed.body,
    });
    const requestStop = Date.now();

    return {
      request: {
        query: parsed.query,
        body: parsed.body,
        headers: parsed.headers,
        full_url: fullUrl.toString(),
      },
      response: {
        http_status: axiosResponse.status,
        duration: requestStop - requestStart,
        request_start_timestamp: requestStart,
        request_stop_timestamp: requestStop,
        response_data: axiosResponse.data,
      },
    };
  } catch (err) {
    const requestStop = Date.now();
    return {
      error: true,
      message: err.response ? err.response.data : err.message,
      http_status: err.response ? err.response.status : 500,
      duration: requestStop - requestStart,
      request_start_timestamp: requestStart,
      request_stop_timestamp: requestStop,
    };
  }
};
