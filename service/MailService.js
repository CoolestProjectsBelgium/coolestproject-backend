'use strict';

const logger = require('pino')()
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
  registrationMail(user) {
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

    email.send({
      template: 'registration',
      message: {
        to: user.email
      },
      locals: {
        locale: 'nl',
        name: user.firstname + ' ' + user.lastname
      }
    })
    .then((log) => { logger.info(log) })
    .catch((log) => { logger.error(log) });
  },
  loginMail(user) {
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

    email.send({
      template: 'login',
      message: {
        to: user.email
      },
      locals: {
        locale: 'nl',
        name: user.firstname + ' ' + user.lastname
      }
    })
    .then((log) => { logger.info(log) })
    .catch((log) => { logger.error(log) });
  }
}