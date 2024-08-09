const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 404; // Set status code to 404
  res.setHeader('Content-Type', 'text/plain');
  res.end('404 Not Found');
});

server.listen(8080, 'localhost', () => {
  console.log('Server running at http://localhost:8080/');
});
