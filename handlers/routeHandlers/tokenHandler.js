/*
* Title: Token Handler
* Description: Handler to handle token related routes
* Author: Sadique Habibullah
* Date: 25/03/2022
*/
// module scaffolding
const handler = {};
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data');

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

// another scaffolding or container 
handler._token = {};

// create a token 
handler._token.post = (requestProperties, callback) => {
    // user logs in with phone number and password
    const phone =
        typeof (requestProperties.body.phone) === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    const password =
        typeof (requestProperties.body.password) === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    // if phone and password is valid, compare the password with the password that was saved against the phone 
    if (phone && password) {
        data.read('users', phone, (err1, user) => {
            const userData = parseJSON(user);
            let hashedPassword = hash(password); // hash the password user uses for logging in
            if (hashedPassword === userData.password) {
                let tokenId = createRandomString(20); // create a token of 20 characters long
                let expiresIn = Date.now() + (60 * 60 * 1000); // the token expires in 1 hour from the moment it is created
                let tokenObject = { // user will get this object from server
                    phone,
                    tokenId,
                    expiresIn
                };

                // store the token 
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) { // if everything ok, send the token object to the client
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side.'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Password in not valid'
                })
            }
        })

    } else {
        callback(400, {
            error: 'You have a problem in your request.'
        })
    }
};

// get stored token
handler._token.get = (requestProperties, callback) => {
    const tokenId =
        typeof (requestProperties.queryStringObject.tokenId) === 'string' &&
            requestProperties.queryStringObject.tokenId.trim().length === 20
            ? requestProperties.queryStringObject.tokenId
            : false;
    if (tokenId) {
        // lookup the token
        data.read('tokens', tokenId, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, { error: 'Requested token was not found' })
            }
        })
    } else {
        callback(404, { error: 'Requested token was not found!' })
    }
};

handler._token.put = (requestProperties, callback) => { // to update a token, we get two properties in request body - 'tokenId' and 'extend' which is a boolean
    const tokenId =
        typeof (requestProperties.body.tokenId) === 'string' &&
            requestProperties.body.tokenId.trim().length === 20
            ? requestProperties.body.tokenId
            : false;
    const extend =
        typeof (requestProperties.body.extend) === 'boolean' &&
            requestProperties.body.extend === true
            ? true
            : false;
    if (tokenId && extend) { // if tokenId is valid and extend is 'true', check if the token has already expired, if it is, we reject the request but if not, we extend the expiry time
        data.read('tokens', tokenId, (err1, tokenData) => {
            let tokenObject = parseJSON(tokenData);
            if (tokenObject.expiresIn > Date.now()) { // chekck if the token has already expired
                tokenObject.expiresIn = Date.now() + (60 * 60 * 1000); // extend the token
                // store the updated token
                data.update('tokens', tokenId, tokenObject, err2 => { // store the extended token
                    if (!err2) {
                        callback(200, {
                            message: 'Your token has been updated and will expire in 1 hour.'
                        });
                    } else {
                        callback(500, {
                            error: 'There was a server side error!'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Token alreary expired!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request.'
        })
    }
};

handler._token.delete = (requestProperties, callback) => {
    const tokenId =
        typeof (requestProperties.queryStringObject.tokenId) === 'string' &&
            requestProperties.queryStringObject.tokenId.trim().length === 20
            ? requestProperties.queryStringObject.tokenId
            : false;
    if (tokenId) {
        data.read('tokens', tokenId, (err1, tokenData) => {
            if (!err1 && tokenData) {
                data.delete('tokens', tokenId, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'Token was deleted successfully!'
                        })
                    } else {
                        callback(500, {
                            error: 'There was a server side error!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'There was a problem in your request!!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        })
    }
};

handler._token.verify = (tokenId, phone, callback) => {
    data.read('tokens', tokenId, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expiresIn) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
};

module.exports = handler;
