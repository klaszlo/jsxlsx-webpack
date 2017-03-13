// This is just a handy directory served script written in node.js

var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./public");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

console.log('Starting at http://localhost:8080');
server.listen(8080);
