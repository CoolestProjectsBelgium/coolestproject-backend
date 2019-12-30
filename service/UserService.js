'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

/**
 * get userinfo for the logged in user
 *
 * returns User
 **/
exports.userinfoGET = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info("LoginToken:"+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id:' + token.id);

      var user = await dba.getUser(token.id);
      resolve({
        language: user.language,
        firstname: user.firstname,
        lastname: user.lastname,
        gsm: user.gsm,
        general_questions: user.general_questions,
        gsm_guardian: user.gsm_guardian,
        medical: user.medical,
        sex: user.sex,
        t_size: user.t_size,
        via: user.via,
        birthmonth: user.birthmonth,
        postalcode: user.postalcode,
        extra: user.extra,
        email: user.email,
        email_guardian: user.email_guardian });

    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

/**
 * update the userinfo
 *
 * returns User
 **/
exports.userinfoPATCH = function(loginToken, user) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: ' + loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);

      // remove fields that are not allowed to change (be paranoid)
      delete user.email;
      delete user.mandatory_approvals;

      // remove non editable fields after specific date
      if (new Date(process.env.TSHIRT_DATE) < new Date()) {
        delete user.t_size;
      }
      
      var u = await dba.updateUser(user, token.id);
      resolve(u);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

/**
 * delete the userinfo
 *
 * returns User
 **/
exports.userinfoDELETE = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      var u = await dba.deleteUser(token.id);
      resolve(u);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

