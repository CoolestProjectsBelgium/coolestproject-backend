'use strict';

const logger = require('pino')();
const respondWithCode = require('../utils/writer').respondWithCode;
var DBA = require('../dba');

/**
 * get userinfo for the logged in user
 *
 * returns User
 **/
exports.userinfoGET = function (user) {
  return new Promise(async function (resolve, reject) {
    try {
      logger.info("LoginLanguage:" + user.language + " email:" + user.email);
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
        street: user.street,
        house_number: user.house_number,
        box_number: user.box_number,
        municipality_name: user.municipality_name,
        email: user.email,
        email_guardian: user.email_guardian,
        delete_possible: await DBA.isUserDeletable(user.id)
      });

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
exports.userinfoPATCH = function (changed_fields, user) {
  return new Promise(async function (resolve, reject) {
    try {
      await DBA.updateUser(changed_fields, user.id);
      resolve(await DBA.getUser(user.id));
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
exports.userinfoDELETE = function (logged_in_user) {
  return new Promise(async function (resolve, reject) {
    try {
      var u = await DBA.deleteUser(logged_in_user.id);
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

