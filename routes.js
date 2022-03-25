/*
* Title: Routes
* Description: Application Routes
* Author: Sadique Habibullah
* Date: 02/03/2022
*/

const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
// below object holds the route names and their corresponding functions that will be called when the routes will be hit
const routes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler
};

module.exports = routes;