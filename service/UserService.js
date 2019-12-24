'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

/**
 * delete user based on id
 *
 * userId Integer userId.
 * no response value expected for this operation
 **/
exports.userDELETE = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get user based on id
 *
 * userId Integer userId.
 * returns User
 **/
exports.userGET = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "language" : "nl",      
  "gsm" : "+32460789101",
  "general_questions" : [ "photo", "photo" ],
  "email_guardian" : "email_guardian",
  "firstname" : "Jane",
  "gsm_guardian" : "+32460789101",
  "medical" : "medical",
  "sex" : "m",
  "project" : {
    "project_type" : "project_type",
    "unused_vouchers" : 0,
    "project_id" : 6,
    "project_lang" : "nl",
    "project_name" : "project_name",
    "project_descr" : "project_descr",
    "participants" : [ null, null ]
  },
  "t_size" : "female_small",
  "lastname" : "Doe",
  "via" : "via",
  "birthmonth" : "2000-01-23",
  "postalcode" : 1000,
  "extra" : "extra",
  "id" : 0,
  "email" : "email"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * update user based on id
 *
 * userId Integer userId.
 * no response value expected for this operation
 **/
exports.userPATCH = function(userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


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
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
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

  
    /*
    examples['application/json'] = {
  "gsm" : "+32460789101",
  "general_questions" : [ "photo", "photo" ],
  "email_guardian" : "email_guardian",
  "firstname" : "Jane",
  "gsm_guardian" : "+32460789101",
  "medical" : "medical",
  "sex" : "m",
  "project" : {
    "project_type" : "project_type",
    "unused_vouchers" : 0,
    "project_id" : 6,
    "project_lang" : "nl",
    "project_name" : "project_name",
    "project_descr" : "project_descr",
    "participants" : [ null, null ]
  },
  "t_size" : "female_small",
  "lastname" : "Doe",
  "via" : "via",
  "birthmonth" : "2000-01-23",
  "postalcode" : 1000,
  "extra" : "extra",
  "id" : 0,
  "email" : "email"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });*/

