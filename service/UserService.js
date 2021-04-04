'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;
var DBA = require('../dba');

const models = require('../models');
const Registration = models.Registration;
var Token = require('../jwts');
const Mail = require('../mailer');

/**
 * Transform internal format to external
 **/
async function getUserDetails(user) {
  const questions = await user.getQuestions();
  const general_questions = [];
  const mandatory_approvals = [];

  for (const question of questions) {
    if (question.mandatory) {
      mandatory_approvals.push(question.id);
    } else {
      general_questions.push(question.id);
    }
  }
  const birthDate = new Date(user.birthmonth);
  return {
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
    address: {
      postalcode: user.postalcode + '',
      street: user.street,
      house_number: user.house_number,
      bus_number: user.box_number,
      municipality_name: user.municipality_name
    },
    delete_possible: await DBA.isUserDeletable(user.id)
  };
}

/**
 * get userinfo for the logged in user
 *
 * returns User
 **/
exports.userinfoGET = async function (user) {
  try {
    return await getUserDetails(user);
  } catch (ex) {
    console.log(ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * update the userinfo
 *
 * returns User
 **/
exports.userinfoPATCH = async function (changed_fields, user) {
  try {
    await DBA.updateUser(changed_fields, user.id);
    return await getUserDetails(await DBA.getUser(user.id));
  } catch (ex) {
    console.log(ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * delete the userinfo
 *
 * returns User
 **/
exports.userinfoDELETE = async function (logged_in_user) {
  console.log('delete user log:',logged_in_user);
  try {
    const u = await DBA.deleteUser(logged_in_user.id);

    // unflag the first user in the waiting list & trigger activation mail
    const otherRegistration = await Registration.findOne({ where: { waiting_list: true }, order: [['createdAt', 'ASC']]  });
    if (otherRegistration) {
      otherRegistration.waiting_list = false;
      await otherRegistration.save();    
      const event = await DBA.getEventActive();
      const token = await Token.generateRegistrationToken(otherRegistration.id);
      await Mail.activationMail(otherRegistration, token, event);
    }

    return u;

  } catch (ex) {
    console.log('delete user log:',ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

