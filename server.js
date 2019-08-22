const http = require('http');
const url = require('url');
const querystring = require('querystring');

const { handler } = require('./index');

// Create a server
http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url);
  // Make an event in the Lambda Proxy Event format
  // http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-input-format
  const event = {
    pathParameters: {
      proxy: parsedUrl.pathname.slice(1),
    },
    queryStringParameters: querystring.parse(parsedUrl.query),
  };
  console.log(event);

  handler(event, null, (error, responseDef) => {
    // Read Lambda output format and send back a response
    // http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format
    response.writeHead(responseDef.statusCode, responseDef.headers);
    const decodedBody = responseDef.isBase64Encoded
      ? Buffer.from(responseDef.body, 'base64')
      : responseDef.body;
    response.write(decodedBody);
    response.end();
  });
}).listen(process.env.PORT || 8081);
