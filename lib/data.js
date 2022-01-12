/**
 * Module for data persistence
 */

// dependency
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

// container library to hold CRUD objects
var lib = {};

/* ROOT DIrectory*/
lib.baseDir = path.join(__dirname, '../.data/');

/**
 * Writes data to a file
 * @param {dirname} dir 
 * @param {String} file 
 * @param {*} data 
 * @param {*} callback 
 */
lib.create = function(dir, file, data, callback) {
    // open the file for editing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, /** file descriptor */ fd) {
        if (!err && fd) {
            // convert the data to string
            var stringData = JSON.stringify(data);

            // write to file and close it!!
            fs.writeFile(fd, stringData, function(err) {
                if (!err) {
                    fs.close(fd, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing file after creation');
                        }
                    });
                } else {
                    callback('Could not write to new file');
                }
            });
        } else {
            callback('Could not create new file, a file may already exist with the same name');
        }
    });
};

/**
 * Retrives the data in a file
 * @param {dirname} dir 
 * @param {string} filename 
 * @param {*} data 
 * @param {*} callback 
 */
lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
        if (!err && data) {
            var parsedData = helpers.parseTojsonObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

/**
 * Updates the entries of a file
 * @param {path} dir 
 * @param {string} file 
 * @param {*} callback 
 */
lib.update = function(dir, file, data, callback) {
    // open file for writing
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, /** file descriptor */ fd) {
        if (!err && fd) {
            // convert data to string
            var stringData = JSON.stringify(data);
            // truncate the file
            fs.truncate(fd, function(err) {
                if (!err) {
                    // if not error, write to file
                    fs.writeFile(fd, stringData, function(err) {
                        if (!err) {
                            // close the file
                            fs.close(fd, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('Error closing updated file')
                                }
                            });
                        } else {
                            callback('Could not write to file')
                        }
                    });
                } else {
                    callback('Error, could not truncate file')
                }
            });
        } else {
            callback('Could not open file for editing, file may have already been deleted or does not exist')
        }
    });
};

/**
 * Delete a file record
 * @param {dirname} dir 
 * @param {string} file 
 * @param {*} callback 
 */
lib.delete = function(dir, file, callback) {
    // unlink the file from the file system
    fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file. File does not exist.');
        }
    });
};


// export the module
module.exports = lib;