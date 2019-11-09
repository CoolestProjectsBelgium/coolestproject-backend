'use strict';

const logger = require('pino')()
const nodemailer = require('nodemailer');
const pug = require('pug');

const registrationTemplate = pug.compileFile('./templates/registration.pug');
const registrationTemplateText = pug.compileFile('./templates/registration_text.pug');

let transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = {
  registrationMail(user) {
    const message = {
      from: process.env.EMAIL,
      to: user.email, 
      subject: 'Registratie',
      html: registrationTemplate(user),
      text: registrationTemplateText(user)
    };
    transport.sendMail(message, function (err, info) {
      if (err) {
        logger.log(err)
      } else {
        logger.log(info);
      }
    });
  }
}