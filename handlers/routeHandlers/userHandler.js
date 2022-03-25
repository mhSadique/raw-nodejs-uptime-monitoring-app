/*
* Title: User Handler
* Description: Handler to handle user related routes
* Author: Sadique Habibullah
* Date: 06/03/2022
*/
// module scaffolding
const handler = {};
const { hash, parseJSON } = require('../../helpers/utilities');
const data = require('../../lib/data');

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

// another scaffolding or container 
handler._users = {};

// method called for 'post' method
handler._users.post = (requestProperties, callback) => {
    const firstName =
        typeof (requestProperties.body.firstName) === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof (requestProperties.body.lastName) === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
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
    const tosAgreement =
        typeof (requestProperties.body.tosAgreement) === 'string' && // Sumit vai compared the type of 'tosAgreement' against 'boolean
            requestProperties.body.tosAgreement.trim().length > 0 // but I had an issue with it. trim() does not work on boolean, so I changed it to 'string'
            // ** ADDED LATER ** instead of going through the above process, what I can do is - check the type of 'tosAgreement' against 'boolean' in the first condition and omit the second condion checking totally
            ? requestProperties.body.tosAgreement
            : false;
    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user does not already exist
        // if it does not, create a new user
        // if not, return an error
        data.read('users', phone, (err1) => {
            if (err1) { // if we get this error, only then we create a new user because this error denotes that we do not have a user with this phone number
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement
                };
                // store the user to database
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'User created successfully!' })
                    } else {
                        callback(500, { 'error': 'Could not create user!' })
                    }
                })
            } else {
                callback(500, {
                    error: 'User already exists!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }
};

// IMPLEMENT AUTHENTICATION
// method that will be called for 'get' method
handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof (requestProperties.queryStringObject.phone) === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        // lookup the user
        data.read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, { error: 'Requested user was not found!' })
            }
        })
    } else {
        callback(404, { error: 'Requested user was not found!' })
    }
};

// IMPLEMENT AUTHENTICATION
// method that will be called for 'put' method
handler._users.put = (requestProperties, callback) => {
    // we do not include tosAgreement because it it actually not changed
    const firstName =
        typeof (requestProperties.body.firstName) === 'string' &&
            requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof (requestProperties.body.lastName) === 'string' &&
            requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
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

    if (phone) {
        if (firstName || lastName || password) {
            // look up the user
            data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };

                // if the user is found, update it
                if (!err1 && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.password = hash(firstName);
                    }

                    // now store the user to database
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, { message: 'User was updated successfully.' })
                        } else {
                            callback(500, { error: 'There was a problem in the server.' });
                        }
                    })
                } else {
                    callback(400, { error: 'You have a problem in your request.' });
                }
            })
        } else {
            callback(400, { error: 'You have a problem in your request.' });
        }
    } else {
        callback(400, { error: 'Invalid phone number. Please try again.' });
    }

};

// IMPLEMENT AUTHENTICATION
// method that will be called for 'delete' method
handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof (requestProperties.queryStringObject.phone) === 'string' &&
            requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;
    if (phone) {
        data.read('users', phone, (err1, userData) => {
            if (!err1 && userData) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User deleted successfully!'
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

module.exports = handler;
