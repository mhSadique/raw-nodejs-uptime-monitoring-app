/*
* Title: Utitlities
* Description: Important utilities functions
* Author: Sadique Habibullah
* Date: 06/03/2022
*/

// dependencies
const crypto = require('crypto');

// module scaffolding
const utilities = {};

// function that parses JSON to object
// need to do this, so that out app does not crash due to an error 
// while parsing the user-given JSON which might be an invalid JSON
// do not trust an user

utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

utilities.hash = (string) => {
    if (typeof (string) === 'string' && string.length > 0) {
        let hash = crypto
            .createHmac('sha256', 'mySecretKey')
            .update(string)
            .digest('hex');
        return hash;
    }
    return false;
};


utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            output += randomCharacter;
        }
        return output;
    } else {
        return false;
    }
};

// export module
module.exports = utilities;