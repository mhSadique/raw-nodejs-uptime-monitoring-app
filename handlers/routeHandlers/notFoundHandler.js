/*
* Title: Not Found Handler
* Description: 404 Not Found Handler
* Author: Sadique Habibullah
* Date: 02/03/2022
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Not Found'
    })
};

module.exports = handler;
