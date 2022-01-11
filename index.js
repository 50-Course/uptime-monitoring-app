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
    var queryObject = req.query;

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

        // determine the handler to handle the request and send it off,
        // if invalid, passes the request onto the notfound handler
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // data object to send to the handler
        var data = {
            trimmedPath: trimmedPath,
            queryObject: queryObject,
            headers: headers,
            reqMethod: reqMethod,
            payload: buffer
        };

        // route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            // use the handler status code, else default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // use the handler payload, else return an empty payload
            payload = typeof(payload) === 'object' ? payload : {};

            // convert payload to a JSON string
            var payloadStr = JSON.stringify(payload);

            // return the server response
            res.writeHead(statusCode);
            res.end(payloadStr);

            // log out the response
            console.log('Request received: ', statusCode + '\twith these payload: ', payloadStr);
        });
    });  
};

// ROUTING REQUESTS

/**
 * Handler object for request handling 
 */
var handlers = {};

/**
 * Returns HTTP 404_NOT_FOUND status code, 
 * if path does not exists
 */
handlers.notFound = function(data, callback) {
    callback(404);
};

/**
 * Returns HTTP status code 200_OK, 
 * if internal server is running 
 */
handlers.ping = function(data, callback) {
    callback(200);
};

/**
 * Sample handler
 * 
 * Returns HTTP 406_METHOD_NOT_ACCEPTABLE status code,
 * and a json response body
 */
handlers.sample = function(data, callback) {
    // return a method not acceptable and a JSON response
    callback(406, {'message': 'Sample handler'});
};

/**
 * Router object for path routing 
 */
var router = {
    sample: handlers.sample,
    ping: handlers.ping
};
