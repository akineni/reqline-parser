function parseReqline(reqline) {
  const allowedMethods = ['GET', 'POST'];
  const allowedKeywords = ['HTTP', 'URL', 'HEADERS', 'QUERY', 'BODY'];
  const parts = reqline.split(' | ');

  // Validate pipe delimiter spacing
  if (reqline.includes('|') && !reqline.includes(' | ')) {
    throw new Error('Pipe delimiter must have exactly one space on each side');
  }

  const parsed = {
    method: '',
    url: '',
    headers: {},
    query: {},
    body: {},
  };

  const seenKeywords = [];

  parts.forEach((part, index) => {
    const firstSpaceIndex = part.indexOf(' ');
    if (firstSpaceIndex === -1) {
      throw new Error('Missing space after keyword');
    }

    const key = part.substring(0, firstSpaceIndex);
    const value = part.substring(firstSpaceIndex + 1).trim();

    if (!allowedKeywords.includes(key)) {
      throw new Error(`Invalid keyword '${key}'. Must be one of: ${allowedKeywords.join(', ')}`);
    }

    // Enforce fixed order
    if (index === 0 && key !== 'HTTP') {
      throw new Error('First keyword must be HTTP');
    }
    if (index === 1 && key !== 'URL') {
      throw new Error('Second keyword must be URL');
    }

    if (seenKeywords.includes(key)) {
      throw new Error(`Duplicate keyword '${key}'`);
    }
    seenKeywords.push(key);

    switch (key) {
      case 'HTTP':
        if (!allowedMethods.includes(value)) {
          throw new Error('Invalid HTTP method. Only GET and POST are supported');
        }
        parsed.method = value;
        break;

      case 'URL':
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

      // ESLint requires default case
      default:
        throw new Error(`Unexpected processing error for keyword '${key}'`);
    }
  });

  if (!seenKeywords.includes('HTTP')) throw new Error('Missing required HTTP keyword');
  if (!seenKeywords.includes('URL')) throw new Error('Missing required URL keyword');

  return parsed;
}

module.exports = {
  parseReqline,
};
