/**
 * API Configuration script
 */

var http = require('http');
var url = require('url');
var fs = require('fs');

var httpServer = http.createServer(function(req, res) {
    res.end('Hello world');
});

httpServer.listen(3000, function() {
    console.log('Server running on port port 3000');
});


