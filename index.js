/**
 * API Configuration script
 */

var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var config = require('./config');

// Initialize HTTP Server
var httpServer = http.createServer(function(req, res) {
    res.end('Hello world');
});

httpServer.listen(config.httpPort, function() {
    console.log('Server running on port port ', config.httpPort);
});

// Initialize HTTPS server
var httpsOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsOptions, function(req, res){
    res.end('Server responded over HTTPS');
});

httpsServer.listen(config.httpsPort, function() {
    console.log('Server running on port ', config.httpsPort);
});
