/*
* Title: Uptime Monitoring Application
* Description: A RESTful API to monitor up or down time of user defined links
* Author: Sadique Habibullah
* Date: 27/02/2022
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');


// app object - module scaffolding
const app = {};

// testing file system

// creating
// data.create('test', 'newFile', { name: 'Sadiue', occupassion: 'Web Developer' }, (err) => {
//     console.log(`Error was ${err}`);
// })

// reading
// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// })

// updating
// data.update('test', 'newFile', { name: 'Sadique', occupassion: 'Web Developer', isExpert: true }, (err) => {
//     console.log(err);
// })

// deleting
// data.delete('test', 'newFile', err => {
//     console.log(err);
// })


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    })
}


// handle request response
app.handleReqRes = handleReqRes;

// start server
app.createServer();
