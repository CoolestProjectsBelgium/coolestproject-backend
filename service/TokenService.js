'use strict';

var jwt = require('jsonwebtoken');

module.exports = {
    generateRegistrationToken(id) {
        return new Promise(function(resolve, reject){
            try {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + Number.parseInt(process.env.TOKEN_VALID_TIME),
                    registrationId: id
                }, process.env.SECRET_KEY)
                resolve(token);
            } catch(err) {
                reject(err)
            }
        });
    },
    generateLoginToken(userId) {
        return new Promise(function(resolve, reject){
            try {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + Number.parseInt(process.env.TOKEN_VALID_TIME),
                    iat: Math.floor(Date.now() / 1000) - 300, // backdate 300 seconds
                    id: userId
                }, process.env.SECRET_KEY)
                resolve(token);
            } catch (err) {
                reject(err)
            }
        });
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