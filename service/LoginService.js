'use strict';

const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

/**
 * Login / Activate account
 *
 * registration Registration The registration to create. (optional)
 * returns Login
 **/
exports.loginPOST = function (login) {
  return new Promise(function (resolve, reject) {
    console.log('validate token');
    TokenService.validateToken(login.jwt).then(async function (validToken) {
      //token success
      console.log(validToken)

      //check if token is registration or login token
      let userId = -1;
      if (validToken.registrationId) {
        console.log('registration token found start creation of user & project');
        console.log(validToken.registrationId);

        // get registration
        var registration = await dba.getRegistration(validToken.registrationId);
        if (registration.project_code) {
          // create user and add to existing project
          var participant = await dba.createUserWithVoucher(
            {
              language: registration.language,
              postalcode: registration.postalcode,
              email: registration.email,
              gsm: registration.gsm,
              firstname: registration.firstname,
              lastname: registration.lastname,
              sex: registration.sex,
              birthmonth: registration.birthmonth,
              mandatory_approvals: registration.mandatory_approvals,
              t_size: registration.t_size,
              via: registration.via,
              medical: registration.medical,
              extra: registration.medical,
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              general_questions: registration.general_questions
            }, registration.project_code
          );
          console.log('created user: ' + participant.id);
          userId = participant.id
        } else {
          // create user with project
          var owner = await dba.createUserWithProject(
            {
              language: registration.language,
              postalcode: registration.postalcode,
              email: registration.email,
              gsm: registration.gsm,
              firstname: registration.firstname,
              lastname: registration.lastname,
              sex: registration.sex,
              birthmonth: registration.birthmonth,
              mandatory_approvals: registration.mandatory_approvals,
              t_size: registration.t_size,
              via: registration.via,
              medical: registration.medical,
              extra: registration.medical,
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              general_questions: registration.general_questions,
              project: {
                project_name: registration.project_name,
                project_descr: registration.project_descr,
                project_type: registration.project_type,
                project_lang: registration.project_lang
              }
            }
          );
          console.log('created user: ' + owner.id);
          console.log('created project: ' + owner.project.id);
        }
        userId = owner.id;
      } else {
        console.log('login token found just generate same token with new validity');
        console.log(validToken.id);
        userId = validToken.id;
      }
      //generate new token and return
      const token = await TokenService.generateLoginToken(userId);
      const date = new Date();
      date.setTime(date.getTime() + (48 * 60 * 60 * 1000));
      resolve({ api_key: token, expires: date });
    })
      .catch(function (response) {
        //token failed
        console.log(response)
        reject(new respondWithCode(500, {
          code: 0,
          message: 'Login failed'
        }));
      });
  });
}

