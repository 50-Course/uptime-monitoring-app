/**
 * API Configuration script
 */


var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var config = require('./config');


// Initialize HTTP Server
var httpServer = http.createServer(function(req, res) {
    // parse the url
    var parsedUrl = url.parse(req.url, true);

    // get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // parse the headers
    var headers = req.headers;
    
    // parse the HTTP method
    var reqMethod = req.method.toLowerCase();
    
    // get the payload
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // send the response
        res.end('Hello World\n');

        // log out the response
        console.log('Request received these payload ', buffer);
    });


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


// A unified server for handing requests
var unifiedServer = function(req, res) {
    
};