'use strict';

const nodemailer = require('nodemailer');
const Email = require('email-templates');
const env = process.env.NODE_ENV || 'development';
const path = require('path');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports = {
  async registrationMail(user) {
    const email = new Email({
      message: {
        from: process.env.EMAIL,
      },
      send: (env === 'development') ? true: false, // This opens the browser to show the mail
      transport: transport,
      i18n: {
        locales:['en', 'nl', 'fr'],
        directory: path.join(__dirname, '..', 'locales')
      }
    });

    var result = await email.send({
      template: 'A3_DeleteProject',//'A2_WelcomeNaActivatie','A1_VraagVoorActivatie', 'A3_DeleteProject,
      message: {
        to: user.email
      },
      locals: {
        locale: 'nl',
        name: user.firstname, //+ ' ' + user.lastname,
        cpid: "CPnn",
        cptitle: user.project_name,
        url: 'https://coolestprojects.be/'
      }
    });
    return result;
  },
  async loginMail(user) {
    const email = new Email({
      message: {
        from: process.env.EMAIL,
      },
      send: (env === 'development') ? true: false, // This opens the browser to show the mail
      transport: transport,
      i18n: {
        locales:['en', 'nl', 'fr'],
        directory: path.join(__dirname, '..', 'locales')
      }
    });

    var result = await email.send({
      template: 'login',
      message: {
        to: user.email
      },
      locals: {
        locale: 'nl',
        name: user.firstname + ' ' + user.lastname
      }
    });
    return result;
  }
}