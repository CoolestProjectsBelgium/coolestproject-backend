'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.logoutPOST = async function (user, response) {
  response.cookie('jwt', null, { 
    maxAge: 0,
    sameSite: process.env.SAMESITE_COOKIE || 'None', 
    secure: process.env.SECURE_COOKIE || true,
    domain: process.env.DOMAIN_COOKIE });
  return;
};

