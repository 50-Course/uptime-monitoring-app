/**
 * API Configuration script
 */

// dependency
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');
var config = require('./lib/config');
var _data = require('./lib/data');
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

// Initialize HTTP Server
var httpServer = http.createServer(function(req, res) {
    unifiedServer(req, res);
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
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, function() {
    console.log('Server running on port ', config.httpsPort);
});


// A unified server for handing requests
var unifiedServer = function(req, res) {
    // parse the url
    var parsedUrl = url.parse(req.url, true);

    // get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // parse the headers
    var headers = req.headers;

    // parse the request query as a query object
    var queryObject = parsedUrl.query;

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
        // console.log(buffer); // todo: DELETE THIS!
        // determine the handler to handle the request and send it off,
        // if invalid, passes the request onto the notfound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryObject: queryObject,
            headers: headers,
            method: reqMethod,
            'payload': helpers.parseTojsonObject(buffer)
        };
        // console.log(data); // todo: DELETE THIS!
        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // use the handler status code, else default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // use the handler payload, else return an empty payload
            payload = typeof(payload) === 'object' ? payload : {};
            // console.log(payload); // todo: DELETE THIS!
            // convert payload to a JSON string
            var payloadStr = JSON.stringify(payload);
            // console.log(payloadStr); // todo: DELETE THIS!
            // return the server response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadStr);

            // log out the response
            console.log('Returned this response: ', statusCode + '\twith these payload: ', payloadStr);
        });
    });  
};

// ROUTING REQUESTS

/**
 * Router object for path routing 
 */
var router = {
    sample: handlers.sample,
    ping: handlers.ping,
    users: handlers.users,
    tokens: handlers.tokens,
    checks: handlers.checks
};
