'use strict';

const nodemailer = require('nodemailer');
const Email = require('email-templates');



//var i18n = helpers.i18n()

const env = process.env.NODE_ENV || 'development';
const path = require('path');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  language: 'en'
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

class Mailer {
  static async loginMail(user, token, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'loginMail'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        login: {
          firstname: user.firstname,
          email_guardian: user.email_guardian,
          year: event.startDate.getFullYear()
        },
        url: process.env.URL + `?token=${token}`,
        website: 'https://coolestprojects.be'
      }
    });
    return result;
  }
  static async welcomeMailOwner(user, project, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'welcomeMailOwner'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname      
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        url: process.env.URL,
        website: 'https://coolestprojects.be'
      }
    });
    return result;
  }
  static async welcomeMailCoWorker(user, project, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'welcomeMailCoWorker'),
      message: {
        to: user.email,
        cc: user.email_guardian
      },
      locals: {
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname      
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        url: process.env.URL,
        website: 'https://coolestprojects.be'
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
        year: event.startDate.getFullYear(),
        user: {
          firstname: user.firstname      
        },
        project: {
          id: project.id,
          title: project.project_name
        },
        url: process.env.URL,
        website: 'https://coolestprojects.be'
      }
    });
    return result;
  }
  static async warningNoProject(user) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'warningNoProject'),
      message: {
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
        user
      }
    });
    return result;
  }
  static async activationMail(registration, token, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'activationMail'),
      message: {
        to: registration.email,
        cc: registration.email_guardian
      },
      locals: {
        locale: 'en',
        registration: {
          firstname: registration.firstname,
          email_guardian: registration.email_guardian,
          year: event.startDate.getFullYear()
        },
        url: process.env.URL + `?token=${token}`,
        website: 'https://coolestprojects.be'
      }
    });
    return result;
  }
  static async ask4TokenMail(users, token, event) {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'ask4TokenMail'),
      message: {
        to: users.email,
        cc: users.email_guardian
      },
      locals: {
        locale: 'en',
        users: {
          firstname: users.firstname,
          email_guardian: users.email_guardian,
          year: event.startDate.getFullYear()
        },
        url: process.env.URL + `?token=${token}`,
        website: 'https://coolestprojects.be'
      }
    
    });
    return result;
  }
  static async testMail() {
    const result = await email.send({
      template: path.join(__dirname, '..', 'emails', 'test'),
      message: {
        to: 'test@test.be'
      },
      locals: {}
    });
    return result;
  }
}

module.exports = Mailer

/*
module.exports = {
    async welcomeMailOwner(participant) {

    },
    async welcomeMailParticipant(user) {

    },
    async testMail() {
        const email = new Email({
            message: {
                from: process.env.EMAIL,
            },
            send: true, // This opens the browser to show the mail
            transport: transport,
            i18n: {
                locales: ['en', 'nl', 'fr'],
                directory: path.join(__dirname, '..', 'locales')
            }
        });
        var result = await email.send({
            template: 'registrationMail',
            message: {
                to: 'test@test.be'
            },
            locals: {}
        });
        return result;
    },
    async registrationMail(user, registrationToken) {
        const email = new Email({
            message: {
                from: process.env.EMAIL,
            },
            send: true, // This opens the browser to show the mail
            transport: transport,
            i18n: {
                locales: ['en', 'nl', 'fr'],
                directory: path.join(__dirname, '..', 'locales')
            }
        });
        const token = await registrationToken
        var result = await email.send({
            template: 'registrationMail',
            message: {
                to: user.email,
                cc: user.email_guardian
            },
            locals: {
                locale: user.language,
                name: user.firstname,
                title: user.project_name,
                url: process.env.URL + 'login?token=' + token
            }
        });
        return result;
    }
    /*
    async registrationMail(user, registrationToken) {
      const email = new Email({
        message: {
          from: process.env.EMAIL,
        },
        send: true, // This opens the browser to show the mail
        transport: transport,
        i18n: {
          locales: ['en', 'nl', 'fr'],
          directory: path.join(__dirname, '..', 'locales')
        }
      });
      const token = await registrationToken
      var result = await email.send({
        template: user.language + '_A1_VraagVoorActivatie',//'A2_WelcomeNaActivatie','A1_VraagVoorActivatie', 'A3_DeleteProject,
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
    async loginMail(user, token) {
      console.log("Login requested sent to " + user.email + " env:" + env)
      const email = new Email({
        message: {
          from: process.env.EMAIL,
        },
        send: true, // This opens the browser to show the mail
        transport: transport,
        i18n: {
          locales: ['en', 'nl', 'fr'],
          directory: path.join(__dirname, '..', 'locales')
        }
      });

      var result = await email.send({
        template: user.language + '_A4_VraagToken',
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
        send: true, // This opens the browser to show the mail ....
        transport: transport,
        i18n: {
          locales: ['en', 'nl', 'fr'],
          directory: path.join(__dirname, '..', 'locales')
        }
      });

      var result = await email.send({
        template: user.language + '_A2_WelcomeNaActivatie',
        message: {
          to: user.email,
          cc: user.email_guardian
        },
        locals: {
          locale: user.language,
          name: user.firstname, //+ ' ' + user.lastname,
          cpid: "CP." + user.project.id,
          cptitle: user.project.project_name,
          urlActivated: process.env.URL + 'login?token=' + token
        }
      });
      return result;
    }

}
*/