'use strict';

const logger = require('pino')()

var models = require('../models');
var Registration = models.Registration;

var MailService = require('./MailService');

/**
 * Create new registration
 *
 * user RegistrationRequest The user to create. (optional)
 * no response value expected for this operation
 **/
exports.registerPOST = function(registration) {
  return new Promise(function(resolve, reject) {

    /** 
     * Extra validation before creating the registration record
     * 1) check if mandatory fields are filled in (mandatory_approvals == ok)
     * 2) check if a project is filled in or a project_code
     * 3) check if the registration is for a minor (extra approval flow via guardian email)
     **/

    Registration.create(registration).then(registration => {
      MailService.registrationMail(registration);
      resolve();
    }).catch((err) => {
      logger.error(err);
      reject();
    });
    
  });
}
