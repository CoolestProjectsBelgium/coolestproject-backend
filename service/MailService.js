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
  async registrationMail(user, registrationToken) {
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
    const token = await registrationToken
    var result = await email.send({
      template: user.language +'_A1_VraagVoorActivatie',//'A2_WelcomeNaActivatie','A1_VraagVoorActivatie', 'A3_DeleteProject,
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        name: user.firstname, //+ ' ' + user.lastname,
        cpid: "CPnn",
        cptitle: user.project_name,
        url: process.env.URL + 'login?token=' + token
      }
    });
    return result;
  },
  async loginMail(user,token) {
      console.log("Login requested sent to "+user.email+" env:"+env)
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
      template: user.language +'_A4_VraagToken',
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        name: user.firstname,      //+ ' ' + user.lastname,
        urlLogin: process.env.URL + 'login?token=' + token
      }
    });
    return result;
  },
  async welcomeMailOwner(user, token) {
    const email = new Email({
      message: {
        from: process.env.EMAIL,
      },
      send: (env === 'production') ? true: false, // This opens the browser to show the mail ....
      transport: transport,
      i18n: {
        locales:['en', 'nl', 'fr'],
        directory: path.join(__dirname, '..', 'locales')
      }
    });

    var result = await email.send({
      template: user.language +'_A2_WelcomeNaActivatie',
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        name: user.firstname, //+ ' ' + user.lastname,
        cpid: "CP."+user.project.id,
        cptitle: user.project.project_name,
        urlActivated: process.env.URL + 'login?token=' + token
      }
    });
    return result;
  }
}