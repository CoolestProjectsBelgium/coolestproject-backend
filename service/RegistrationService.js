'use strict';

const logger = require('pino')()
const respondWithCode = require('../utils/writer').respondWithCode
var DBA = require('../dba');

var models = require('../models');
var Registration = models.Registration;

var Mail = require('../mailer');
var Token = require('../jwts');

/**
 * Create new registration
 *
 * user RegistrationRequest The user to create. (optional)
 * no response value expected for this operation
 **/
exports.registerPOST = function (registration_fields) {
  return new Promise(async function (resolve, reject) {

    /** 
     * Extra validation before creating the registration record
     * 1) check if mandatory fields are filled in (mandatory_approvals == ok)
     * 2) check if a project is filled in or a project_code
     * 3) check if the registration is for a minor (extra approval flow via guardian email)
     **/
    try {
      const registration = await DBA.createRegistration(registration_fields);

      // Check if email exists if so ignore registration
      if (!(await DBA.doesEmailExists(registration_fields.email))) {
        const token = await Token.generateRegistrationToken(registration.id);
        const event = await DBA.getEventActive();
        Mail.activationMail(registration, token, event);
      } else {
        logger.error("user tried to register with same email: " + registration.email);
      }
      resolve();

    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }

  });
}
