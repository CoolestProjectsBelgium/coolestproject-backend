'use strict';

const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');

const models = require('../models');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  language: 'nl'
});

const email = new Email({
  message: {
    from: process.env.EMAIL,
  },
  send: true,
  preview: false,
  transport: transport,
  i18n: {
    locales: ['en', 'nl', 'fr'],
    directory: path.join(__dirname, '..', 'locales')
  },
  views: {
    options: {
      extension: 'handlebars'
    }
  }
});

const websiteUrl = 'https://coolestprojects.be';

class Mailer {
  static async welcomeMailOwner(user, project, event, token) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'welcomeMailOwner'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        url: Mailer.baseUrlWithLanguage(user) + `/login?token=${token}`,
        website: websiteUrl
      }
    });
    return result;
  }
  static async welcomeMailCoWorker(user, project, event, token) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'welcomeMailCoWorker'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        url: Mailer.baseUrlWithLanguage(user) + `/login?token=${token}`,
        website: websiteUrl
      }
    });
    return result;
  }
  static async deleteMail(user, project, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'deleteMail'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        is_owner: project.ownerId == user.id,
        url: Mailer.baseUrlWithLanguage(user),
        website: websiteUrl
      }
    });
    return result;
  }
  static async warningNoProject(user) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'warningNoProject'),
      message: {
        locale: user.language,
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        user
      }
    });
    return result;
  }
  static async deadlineApproaching(user) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'deadlineApproaching'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        user
      }
    });
    return result;
  }
  static async waitingMail(registration, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'waitingMail'),
      message: {
        to: registration.email,
        cc: registration.email_guardian
      },
      locals: {
        locale: registration.language,
        registration: {
          firstname: registration.firstname,
          email_guardian: registration.email_guardian,
          year: event.startDate.getFullYear()
        },
        website: websiteUrl
      }
    });
    return result;
  }
  /**
   * 
   * @param {models.Registration} registration 
   * @param {String} token 
   * @param {models.Event} event 
   * @returns 
   */
  static async activationMail(registration, token, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'activationMail'),
      message: {
        to: registration.email,
        cc: registration.email_guardian
      },
      locals: {
        locale: registration.language,
        registration: {
          firstname: registration.firstname,
          email_guardian: registration.email_guardian,
          year: event.startDate.getFullYear()
        },
        // Hier is er geen user, maar wel een registration, als het maar .language supporteerd
        url: Mailer.baseUrlWithLanguage(registration) + `/login?token=${token}`,
        website: websiteUrl
      }
    });
    return result;
  }
  static async ask4TokenMail(user, token, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'ask4TokenMail'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        locale: user.language,
        user: {
          firstname: user.firstname,
          email_guardian: user.email_guardian,
          year: event.startDate.getFullYear()
        },
        url: Mailer.baseUrlWithLanguage(user) + `/login?token=${token}`,
        website: websiteUrl
      }
    });
    return result;
  }

  static async emailExistsMail(emailIn, language) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'emailExistsMail'),
      message: {
        to: emailIn
      },
      locals: {
        locale: language
      }
    });
    return result;
  }

  static baseUrlWithLanguage(user) {
    return process.env.URL + ((user.language != 'nl') ? '/' + user.language : '');
  }
}

module.exports = Mailer;