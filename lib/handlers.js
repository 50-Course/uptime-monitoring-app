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

/* ------------------------------------------------------------------------- */
// USER SERVICE

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
                    // console.log(hashedPassword); // todo: DELETE THIS!
                    var userObject = {
                        username: username,
                        phone: phone,
                        hashedPassword: hashedPassword,
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
 * Request from the User's service, user's data
 * the callback fires error if user's does not exist
 * 
 * Required: phone
 * 
 * @param {String} phone
 */
handlers._users.get = function(data, callback) {
    // check if phone is valid
    var phone = typeof(data.queryObject.phone) === 'string' && data.queryObject.phone.trim().length === 10 ? data.queryObject.phone.trim() : false;
    if (phone) {
        // lookup the user data
        _data.read('users', phone, function(err, data) {
            if (!err && data) {
                // delete the hashed user password
                delete data.hashedPassword;
                callback(200, data);
            } else {
                // user not found
                callback(404);
            }
        });
    } else {
        callback(400, {'Error':'Missing required fields'});
    }
};

/**
 * Fires off a payloaded request to the User's service,
 * use this call to modify user data.
 * 
 * Required: phone
 * 
 * Optional: username or password (or both)
 * 
 * @param {String} phone
 * @param {String} username
 * @param {String} password
 * 
 */
handlers._users.put = function(data, callback) {
    // check for required field
    var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    // check for optional fields
    var username = typeof(data.payload.username) === 'string' && data.payload.username.trim().length > 0 ? data.payload.username.trim() : false;
    var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // look up the user, if specified user matches that of the records
    // updates the entries of the user
    if (phone) {
        if (username || password) {
            // lookup the user record
            _data.read('users', phone, function(err, userData) {
                if (!err && userData) {
                    // updates the username with new entry
                    if (username) {
                        userData.username = username;
                    }

                    // updates the password with new entry
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }

                    // update the user detail on the database
                    _data.update('users', phone, userData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error':'Could not update user records'})
                        }
                    });
                } else {
                    callback(400, {'Error':'Could not find the specified user details for update'});
                }
            });
        } else {
            callback(400, {'Error':'No data provided for update. You may update your username or your cell number'});
        }
    } else {
        callback(400, {'Error':'Missing required field'});
    }
};

/**
 * Deletes a user record from the User's service. Note: CRITICAL
 * 
 * Only send this request over authenticated call
 * 
 * Required: phone
 * 
 * @param {String} phone
 */
handlers._users.delete = function(data, callback) {
    // check if phone is valid, then deletes the user
    // TODO: clean up (remove) every other association to this user; checks and tokens
    // TODO: allow this only over authenticated requestts
    var phone = typeof(data.queryObject.phone) === 'string' && data.queryObject.phone.trim().length === 10 ? data.queryObject.phone.trim() : false;
    if (phone) {
        // lookup the user data, then removes it from the database
        // if user is not found, returns an error upfront
        _data.read('users', phone, function(err, data) {
            if (!err && data) {
                // delete tthe user
                _data.delete('users', phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error':'Could not delete the specified user'});
                    }
                });
            } else {
                callback(404, {'Error':'Could not find the records of the specified user'});
            }
        });
    } else {
        callback(400, {'Error':'Missing required field'});
    }
}

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

/* ------------------------------------------------------------------- */
// TOKENS SERVICE

/**
 * Tokens object
 * 
 * Accepable methods: POST, PUT, DELETE, GET
 * 
 * Usage: handlers._tokens.$[method]
 */
handlers.tokens = function (data, callback) {
    // define an array of acceptable request methods,
    // if a request to this handler matches that of the array
    // set the inner method of this handler to the requests' method
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        // method is not valid, return HTTP 405_Method_Not_Allowed
        callback(405);
    }
};

/*
 * Tokens sub-methd
 */
handlers._tokens = {};

/**
 * Send a request to the Token Service to create a unique token,
 * for a specified user. Tokens is valid for a certain period 
 * of time.
 * 
 * Required data: phone, password
 * 
 * @param {*} data 
 * @param {*} callback 
 */
handlers._tokens.post = function (data, callback) {
    // check for required fields
    var phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    console.log(phone, password);
    if (phone && password) {
        // if valid, looks up the user, then validates the inputed user's password,
        // against the user's password in the database.
        _data.read('users', phone, function(err, userData) {
            if (!err && userData) {
                // hash user password
                var hashedPassword = helpers.hash(password);
                // check the user's password for a match
                if (hashedPassword === userData.hashedPassword) {
                    // if password is valid creates a token for the speified user,
                    // valid for 1 hour 
                    var tokenId = helpers.generateRandomString(64);
                    var expires = Date.now() + 1000 * 60 * 60;

                    // token object for a specified user
                    var tokenObject = {
                        phone: phone,
                        id: tokenId,
                        expires: expires
                    };

                    // store the token object
                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error':'Cannot create token for this user'})
                        }
                    });
                } else {
                    callback(400, {'Error':'User\'s password does not match our record!'})
                }
            } else {
                callback(404, {'Error':'Could not find the specified user'})
            }
        });
    } else {
        callback(400, {'Error':'Missing required fields'});
    }
};

handlers._tokens.get = function (data, callback) {
    
};

handlers._tokens.put = function (data, callback) {
    
};

handlers._tokens.delete = function (data, callback) {
    
};

// export the module
module.exports = handlers;
