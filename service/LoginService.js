'use strict';

const logger = require('pino')();
const addSeconds = require('date-fns/addSeconds');
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode;
var dba = require('../service/DBService');
var MailService = require('./MailService');

/**
 * Ask for logintoken via mail
 *
 * get user & send login token via mail
 **/
exports.mailLoginPOST = function (login) {
  return new Promise(async function (resolve, reject) {
    logger.info('login requested for: ' + login.email);

    try {
      var users = await dba.getUsersViaMail(login.email);
      for (const user of users) {
        logger.info('user found: ' + user.id);
        // only one token every n seconds
        var tokenTime = -1;
        if (user.last_token !== null) {
          tokenTime = addSeconds(user.last_token, process.env.TOKEN_RESEND_TIME || 0); 
        }
        if (new Date() > tokenTime) {
          // generate new token for user
          await dba.updateLastToken(user);
          const token = await TokenService.generateLoginToken(user.id);
          await MailService.loginMail(user, token);
        } else {
          logger.info('Token requested but time is not passed yet: ' + user.email);
        }
      }
      resolve();
    } catch (ex){
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
exports.loginPOST = function (login) {
  return new Promise(function (resolve, reject) {
    logger.info('validate token: ' + login.jwt);
    TokenService.validateToken(login.jwt).then(async function (validToken) {
      //token success
      logger.info(validToken)
      //check if token is registration or login token
      let userId = -1;
      if (validToken.registrationId) {
        logger.info('registration token found start creation of user & project');
        logger.info(validToken.registrationId);
        // get registration
        var registration = await dba.getRegistration(validToken.registrationId);
        // no registration found in our table (already created)
        if (registration === null){
          reject(new respondWithCode(500, {
            code: 0,
            message: 'Login failed'
          }));
          return;
        }
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
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              general_questions: registration.general_questions
            }, 
            registration.project_code,  
            registration.id
          );
          logger.info('created user: ' + participant.id);
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
              gsm_guardian: registration.gsm_guardian,
              email_guardian: registration.email_guardian,
              general_questions: registration.general_questions,
              project: {
                project_name: registration.project_name,
                project_descr: registration.project_descr,
                project_type: registration.project_type,
                project_lang: registration.project_lang
              }
            },
            registration.id
          );
          logger.info('created user: ' + owner.id);
          logger.info('created project: ' + owner.project.id);
          userId = owner.id;
        }
      } else {
        logger.info('login token found just generate same token with new validity');
        logger.info(validToken.id);
        userId = validToken.id;
      }
      //generate new token and return
      const token = await TokenService.generateLoginToken(userId);

      //sent welcome mail
      if(validToken.registrationId){
        MailService.welcomeMailOwner(owner, token);
      }

      resolve({ api_key: token, expires: addSeconds(new Date(),  process.env.TOKEN_VALID_TIME || 0), language: await dba.getUser(userId).language });
    })
      .catch(function (response) {
        //token failed
        logger.error(response)
        reject(new respondWithCode(500, {
          code: 0,
          message: 'Login failed'
        }));
      });
  });
}

