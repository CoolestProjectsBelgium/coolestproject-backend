'use strict';

const logger = require('pino')();
const addSeconds = require('date-fns/addSeconds');
const Token = require('../jwts');
const respondWithCode = require('../utils/writer').respondWithCode;
var DBA = require('../dba');
var Mail = require('../mailer');

/**
 * Ask for logintoken via mail
 *
 * get user & send login token via mail
 **/
exports.mailLoginPOST = function (login) {
  return new Promise(async function (resolve, reject) {
    logger.info('login requested for: ' + login.email);
    const event = await DBA.getEventActive();
    try {
      console.log('Event:',event);
      var users = await DBA.getUsersViaMail(login.email, event);
      for (const user of users) {
        logger.info('user found: ' + user.id);
        // only one token every n seconds
        var tokenTime = -1;
        if (user.last_token !== null) {
          tokenTime = addSeconds(user.last_token, process.env.TOKEN_RESEND_TIME || 0);
        }
        if (new Date() > tokenTime) {
          // generate new token for user
          await DBA.updateLastToken(user.id);
          const token = await Token.generateLoginToken(user.id);
          await Mail.ask4TokenMail(user, token, event);
        } else {
          logger.info('Token requested but time is not passed yet: ' + user.email);
        }
      }
      resolve();
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, { code: 0, message: 'Backend error' }));
    }
  });
};
/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.loginPOST = function (user, response) {
  return new Promise(async function (resolve, reject) {
    const token = await Token.generateLoginToken(user.id);
    const expires = addSeconds(Date.now(), 172800 || 0);
    response.cookie('jwt', token, { maxAge: 172800 * 1000, httpOnly: true }); //, secure: process.env.SECURE_COOKIE 
    resolve({ expires, language: user.language });
  });
};

