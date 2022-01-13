/**
 * Environment Variables script
 */

var environments = {};

// staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashToken: 'thisIsAsecret',
    maxChecks: 5
};

// production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashToken: 'thisIsAnothersecret',
    maxChecks: 5
};

// determine which environent variable is passed as command line arg
var currEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check if the current environment is a valid one, else default to, staging environment
var envToExport = typeof(environments[currEnvironment]) === 'object' ? environments[currEnvironment] : environments.staging;

// export the active environment
module.exports = envToExport;
