'use strict';

var jwt = require('jsonwebtoken');

module.exports = {
    async generateRegistrationToken(id) {
        const token = jwt.sign({ registrationId: id }, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_VALID_TIME || 0
        });
        return token;
    },
    async generateLoginToken(userId) {
        const token = jwt.sign({ id: userId }, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_VALID_TIME || 0
        });
        return token;
    },
    validateToken(token) {
        return new Promise(function(resolve, reject){
            jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
                if (err) {
                    reject({ auth: false, message: 'Failed to authenticate token in TokenService.js.' });
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}