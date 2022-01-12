/**
 * Request Handlers
 */


// dependency
var _data = require('./data');
var helpers = require('./helpers');

/**
 * Handler object for request handling 
 */
var handlers = {};

/**
 * User object
 * 
 * Accepable methods: POST, PUT, DELETE, GET
 * 
 * Usage: handlers._users.$[method]
 */
handlers.users = function(data, callback) {
    // define an array of acceptable request methods,
    // if a request to this handler matches that of the array
    // set the inner method of this handler to the requests' method
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        // method is not valid, return HTTP 405_Method_Not_Allowed
        callback(405);
    }
};

/*
 * container for users sub-methods 
 */
handlers._users = {};

/**
 * Sends a request to the User's service, create a new user with
 * this function.
 * 
 * Required: username, password, phone, tosAgreement
 * 
 * Optional: None
 * 
 * @param {*} data 
 * @param {*} callback 
 */
handlers._users.post = function(data, callback) {
    // check for the required fields
    var username = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username.trim() : false;
    var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? true : false;
    
    // check if user already exists, if not create a new user
    if (username && phone && password && tosAgreement) {
        _data.read('users', phone, function(err, data) {
            if (err) {
                // hash the user password
                var hashedPassword = helpers.hash(password);
                // if password is sucessfully hashed, create a user object
                // and store the user
                if (hashedPassword) {
                    console.log(hashedPassword); // todo: DELETE THIS!
                    var userObject = {
                        username: username,
                        phone: phone,
                        password: hashedPassword,
                        tosAgreement: tosAgreement
                    }

                    _data.create('users', phone, userObject, function(err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error':'Unable to create new user'});
                        }
                    });
                } else {
                    callback(500, {'Error':'Unable to hash user\'s password'});
                }
            } else {
                // user already exist
                callback(400, {'Error':'User with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error':'Missing required fields'});
    }
};

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


 // export the module
 module.exports = handlers;