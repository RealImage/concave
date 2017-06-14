const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Create a server
http.createServer((request, response) => {
   // Parse the request containing file name
  console.log(request.url);
  const parsedUrl = url.parse(request.url);

   // Print the name of the file for which request is made.
  console.log(parsedUrl.pathname.slice(1));
  console.log(querystring.parse(parsedUrl.query));


  response.writeHead(200, { 'Content-Type': 'text/html' });
  // response.write(data.toString());

  response.end();
}).listen(8081);
