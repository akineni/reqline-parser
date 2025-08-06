function parseReqline(reqline) {
  // const requiredKeywords = ['HTTP', 'URL'];
  const allowedMethods = ['GET', 'POST'];
  const parts = reqline.split(' | ');

  const parsed = {
    method: '',
    url: '',
    headers: {},
    query: {},
    body: {},
  };

  let foundHTTP = false;
  let foundURL = false;

  parts.forEach((part) => {
    const firstSpaceIndex = part.indexOf(' ');
    if (firstSpaceIndex === -1) {
      throw new Error('Missing space after keyword');
    }

    const key = part.substring(0, firstSpaceIndex);
    const value = part.substring(firstSpaceIndex + 1).trim();

    switch (key) {
      case 'HTTP':
        foundHTTP = true;
        if (!allowedMethods.includes(value)) {
          throw new Error('Invalid HTTP method. Only GET and POST are supported');
        }
        parsed.method = value;
        break;

      case 'URL':
        foundURL = true;
        parsed.url = value;
        break;

      case 'HEADERS':
      case 'QUERY':
      case 'BODY':
        try {
          parsed[key.toLowerCase()] = JSON.parse(value);
        } catch {
          throw new Error(`Invalid JSON format in ${key} section`);
        }
        break;

      default:
        throw new Error('Keywords must be uppercase and valid');
    }
  });

  if (!foundHTTP) throw new Error('Missing required HTTP keyword');
  if (!foundURL) throw new Error('Missing required URL keyword');

  return parsed;
}

module.exports = {
  parseReqline,
};
