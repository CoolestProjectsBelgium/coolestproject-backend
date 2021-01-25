'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.logoutPOST = function (user, response) {
  return new Promise(async function (resolve, reject) {
    response.cookie('jwt', { maxAge: 0 });
    resolve();
  });
}

