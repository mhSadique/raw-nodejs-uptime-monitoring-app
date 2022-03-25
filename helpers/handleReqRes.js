/*
* Title: Request Response Handler
* Description: Request response handle function
* Author: Sadique Habibullah
* Date: 02/03/2022
*/
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');


// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // handle request
    // get the url and parse it into url object
    const parsedUrl = url.parse(req.url, true);

    // get the pathname property from the url object
    const path = parsedUrl.pathname;

    // trim the slashes from the start and end of the pathname with regex
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the http method
    const method = req.method.toLowerCase();

    // get the query strings
    const queryStringObject = parsedUrl.query;

    // get custom data sent in the request header
    const headersObject = req.headers;

    // we will pass below object into the 'chosenHandler')
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    };

    // get the data received in the request body and since the data comes as stream, convert it into normal text
    // to do this, use the 'decoder' below to convert the buffer to string
    const decoder = new StringDecoder('utf-8');

    // create a variable which will be fed with decoded texts phase by phase as the text comes buffer by buffer
    let realData = '';

    // check if the pathname exists in our defined routenames
    // if it does, refer to the corresponding route handler function to 'chosenHandler'
    // if not, refer to the 'notFoundHandler' function to 'chosenHanler'
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    // listen on the 'data' event and when data is received, convert it into real text from buffer and append it to variable "realData" 
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })
    // upon the end of receiving data, send a response to the client
    req.on('end', () => {
        // ??? need to know what the below line does
        realData += decoder.end();

        // append 'readData' to 'requestProperties' because route handlers need it
        // before appending, parse the JSON into object
        // parseJSON() is coming from our utility library
        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};

            // convert the payload into JSON
            const payloadString = JSON.stringify(payload);

            // set content type to header
            res.setHeader('Content-Type', 'application/json');

            // set status code to header
            res.writeHeader(statusCode);

            // return the final response
            res.end(payloadString);
        });
        // console.log(realData);
        // handle response
        // res.end('Hellooo Programmers') // this was giving an error and did not understand, so I commented it out
    })

};

module.exports = handler;
