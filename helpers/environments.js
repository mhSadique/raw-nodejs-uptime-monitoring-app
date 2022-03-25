/*
* Title: Environments
* Description: Hanlde all environment related things
* Author: Sadique Habibullah
* Date: 02/03/2022
*/

// module scaffolding
const environment = {};

// config for staging environment
environment.staging = {
    port: 3000,
    envName: 'staging'
};

// config for production environment
environment.production = {
    port: 5000,
    envName: 'production'
};

// determine which environment was passed
// if no environment is passed, defaults to 'stating'
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export corrensponding environment object
// defaults to 'staging' environment
const environmentToExport = typeof (environment[currentEnvironment]) === 'object' ? environment[currentEnvironment] : environment.staging;

// export module
module.exports = environmentToExport;