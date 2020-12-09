'use strict';

const addYears = require('date-fns/addYears')
const parseISO = require('date-fns/parseISO')
const logger = require('pino')()
const respondWithCode = require('../utils/writer').respondWithCode
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
exports.userinfoPATCH = function (logged_in_user, user) {
  return new Promise(async function (resolve, reject) {
    try {
      // remove fields that are not allowed to change (be paranoid)
      delete user.email;
      delete user.mandatory_approvals;

      // remove non editable fields after specific date
      if (parseISO(process.env.TSHIRT_DATE) < new Date()) {
        logger.info('tshirt date is passed');
        delete user.t_size;
      }

      // cleanup guardian fields when not needed anymore
      const minGuardian = addYears(parseISO(process.env.START_DATE), -1 * process.env.GUARDIAN_AGE);
      console.log("minGuardian:" + minGuardian + "this.birthmonth:" + parseISO(user.birthmonth))
      if (minGuardian > parseISO(user.birthmonth)) {
        logger.info('remove guardian information');
        user.gsm_guardian = null;
        user.email_guardian = null;
      }
      var u = await DBA.updateUser(user, token.id);
      resolve({
        general_questions: u.general_questions,
        mandatory_approvals: u.mandatory_approvals,
        language: u.language,
        postalcode: u.postalcode,
        email: u.email,
        firstname: u.firstname,
        lastname: u.lastname,
        sex: u.sex,
        birthmonth: u.birthmonth,
        t_size: u.t_size,
        via: u.via,
        medical: u.medical,
        gsm: u.gsm,
        gsm_guardian: u.gsm_guardian,
        email_guardian: u.email_guardian
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

