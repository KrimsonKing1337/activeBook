let http = require('http');
let staticServer = require('node-static');
let file = new staticServer.Server('./new_view');

http.createServer(function(req, res) {
    file.serve(req, res);
}).listen(8080);

console.log('Server running on port 8080');