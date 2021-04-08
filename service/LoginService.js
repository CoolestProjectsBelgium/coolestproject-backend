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
exports.mailLoginPOST = async function (login) {
  try {
    var users = await DBA.getUsersViaMail(login.email);
    for (const user of users) {
      logger.info('user found: ' + user.id);
      const event = await user.getEvent();
      if (event.closed) {
        throw Error('event is closed');
      }
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
    return;
  } catch (ex) {
    logger.error(ex);
    throw new respondWithCode(500, { code: 0, message: 'Backend error' });
  }
};
/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.loginPOST = async function (user, response) {
  const token = await Token.generateLoginToken(user.id);
  const expires = addSeconds(Date.now(), 172800 || 0);
  response.cookie('jwt', token, { 
    maxAge: 172800 * 1000, 
    httpOnly: true, 
    sameSite: process.env.SAMESITE_COOKIE || 'None', 
    secure: process.env.SECURE_COOKIE === 'true',
    domain: process.env.DOMAIN_COOKIE  });
  return { expires, language: user.language };
};

