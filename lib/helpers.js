/**
 * Helper functions for optimizing tasks
 */


// dependency
var crypto = require('crypto');
var config = require('./config');

/**
 * helpers object
 */
var helpers = {};


/**
 * Returns hashed value for a given string
 * @param {string} str 
 */
helpers.hash = function(str) {
    // returns boolean if inputed str as a length of <= 0
    // otherwise, returns the hashed value
    if (typeof(str) === 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashToken).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

/**
 * Returns long stringed set of characters for tokenization
 * @param {*} strlength 
 */
helpers.generateRandomString = function (strLength) {
    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // define possible characters that can make up a string
        var possibleCharacters = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789!#';

        // start the final str
        var str = '';
        for (i=1; i <= strLength; i++) {
            // grab a random possible character
            var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))
            // append this character to the final str
            str += randomChar;
        }

        return str;
    } else {
        return false;
    }
};


/**
 * Returns a JSON string o
 * @param {*} str 
 */
helpers.parseTojsonObject = function (str) {
    try {
        // return a parsed object, if error, return an empty object
        var obj = JSON.parse(str);
        return obj;
    } catch (e) {
        return {};
    }
};

helpers.validate = function(type, obj, callback) {
    // if email handle it, else if token handle it differently
}

// export the module
module.exports = helpers;