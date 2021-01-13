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

      const questions = await user.getQuestions();
      const general_questions = [];
      const mandatory_approvals = [];

      for (const question of questions) {
        const q = await question.getQuestion();
        if (q.mandatory) {
          mandatory_approvals.push(q.id)
        } else {
          general_questions.push(q.id)
        }
      }
      const birthDate = new Date(user.birthmonth)
      resolve({
        language: user.language,
        year: birthDate.getFullYear(),
        month: birthDate.getMonth(),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        sex: user.sex,
        gsm: user.gsm,
        via: user.via,
        medical: user.medical,
        email_guardian: user.email_guardian,
        gsm_guardian: user.gsm_guardian,
        t_size: user.sizeId,
        general_questions: general_questions,
        mandatory_approvals: mandatory_approvals,
        contact: {
          postalcode: user.postalcode,
          street: user.street,
          house_number: user.house_number,
          bus_number: user.box_number,
          municipality_name: user.municipality_name
        },
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

