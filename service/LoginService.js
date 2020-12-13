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
    try {
      var users = await DBA.getUsersViaMail(login.email);
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
          const event = await DBA.getEventActive();
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
}
/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.loginPOST = function (user) {
  return new Promise(async function (resolve, reject) {
    const token = await Token.generateLoginToken(user.id);
    resolve({ api_key: token, expires: addSeconds(new Date(), process.env.TOKEN_VALID_TIME || 0), language: user.language });
  });
}

