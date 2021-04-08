'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;
var DBA = require('../dba');
var Mail = require('../mailer');
var Token = require('../jwts');

/**
 * Create new registration
 *
 * user RegistrationRequest The user to create. (optional)
 * no response value expected for this operation
 **/
exports.registerPOST = async function (registration_fields) {

  /** 
     * Extra validation before creating the registration record
     * 1) check if mandatory fields are filled in (mandatory_approvals == ok)
     * 2) check if a project is filled in or a project_code
     * 3) check if the registration is for a minor (extra approval flow via guardian email)
     **/
  try {
    // Check if email exists if so ignore registration
    const event = await DBA.getEventActive();
    if (!(await DBA.doesEmailExists(registration_fields.user.email, event))) {
      const registration = await DBA.createRegistration(registration_fields);
      if(!registration.waiting_list){
        const token = await Token.generateRegistrationToken(registration.id);
        Mail.activationMail(registration, token, event);
      } else {
        Mail.waitingMail(registration, event);
      }
    }
    else { //send emailExistsMail
      const email = registration_fields.user.email;
      var users = await DBA.getOnlyUsersViaMail(email, event); // The result is always a list or collection!
      for (const user of users) {
        const lang = user.language;
        console.log('UserError: Calling emailExistsMail=', email, 'language:', lang);
        Mail.emailExistsMail(email, lang);
      }
    }
    return;

  } catch (ex) {
    console.log(ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};
