const DBA = require('../dba');
const Token = require('../jwts');
const Mailer = require('../mailer');

/**
 * @param {*} models 
 * @param {DBA} database 
 * @param {Mailer} mailer 
 * @param {Token} jwt 
 * @returns 
 */
module.exports = function(models, database, mailer, jwt) {

  const operations = {
    post
  };
  
  async function post(req, res) {
    const registration_fields = req.body;
    const event = await database.getEventActive();

    // Check if email exists if so ignore registration
    if (!(await database.doesEmailExists(registration_fields.user.email, event))) {
      const registration = await database.createRegistration(registration_fields);
      if(!registration.waiting_list){
        const token = await jwt.generateRegistrationToken(registration.id);
        await mailer.activationMail(registration, token, event);
      } else {
        await  mailer.waitingMail(registration, event);
      }
    }
    else { //send emailExistsMail
      const email = registration_fields.user.email;
      let users = await database.getOnlyUsersViaMail(email, event); // The result is always a list or collection!
      for (const user of users) {
        const lang = user.language;
        console.log('UserError: Calling emailExistsMail=', email, 'language:', lang);
        await mailer.emailExistsMail(email, lang);
      }
    } 

    res.status(200).send(null);
  }
    
  return operations;
};