const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('admin-bro-expressjs');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('../models');
var dba = require('../dba');
const sequelize = db.sequelize;
const sessionStore = new SequelizeStore({ db: sequelize });
var MailService = require('../service/MailService');
var TokenService = require('../service/TokenService');
var stream = require('stream');

const reportParent = {
  name: 'Reporting',
  icon: 'fa fa-stream',
}

const internalParent = {
  name: 'Internal',
  icon: 'fa fa-exclamation-triangle',
}

const adminBroOptions = {
  databases: [db],
  rootPath: '/admin',
  branding: {
    companyName: 'Coolest Projects',
  },
  resources: [
    {
      resource: db.Registration,
      options: {
        actions: {
          new: {
            isVisible: false
          },
          mailAction: {
            actionType: 'record',
            label: 'Resend confirmation mail',
            icon: 'fas fa-envelope',
            isVisible: true,
            handler: async (request, response, data) => { /*
              if (!request.params.recordId || !data.record) {
                throw new NotFoundError([
                  'You have to pass "recordId" to Mail Action',
                ].join('\n'), 'Action#handler')
              }
              try {
                const registrationToken = await TokenService.generateRegistrationToken(request.params.recordId);
                const register = await dba.getRegistration(request.params.recordId)
                MailService.registrationMail(register, registrationToken);
              } catch (error) {
                return {
                  record: data.record.toJSON(data.currentAdmin),
                  notice: {
                    message: error,
                    type: 'error',
                  },
                }
              }
              return {
                record: data.record.toJSON(data.currentAdmin),
                notice: {
                  message: 'Re-registration mail sent',
                  type: 'success',
                },
              } */
            },
            component: false,
          }
        },
        properties: {
          mandatory_approvals: { isArray: true, availableValues: [{ "label": "ok", "value": "ok" }] },
          general_questions: {
            isArray: true, availableValues: [{ "label": "photo", "value": "photo" }
              , { "label": "contact", "value": "contact" }, { "label": "no_photo", "value": "no_photo" }, { "label": "no_contact", "value": "no_contact" }]
          }
        }
      }
    },
    {
      resource: db.Session,
      options: {
        parent: internalParent,
        actions: {
          new: {
            isVisible: false
          }
        }
      }
    },
    {
      resource: db.Account,
      options: {
        parent: internalParent
      }
    },
    {
      resource: db.Project,
      options: {
        actions: {
          new: {
            isVisible: false
          }
        },
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
        }
      }
    },
    {
      resource: db.User,
      options: {
        properties: {
          via: { type: 'richtext' },
          medical: { type: 'richtext' },
          mandatory_approvals: { isArray: true, availableValues: [{ "label": "ok", "value": "ok" }] },
          general_questions: {
            isArray: true, availableValues: [{ "label": "photo", "value": "photo" }
              , { "label": "contact", "value": "contact" }, { "label": "no_photo", "value": "no_photo" }, { "label": "no_contact", "value": "no_contact" }]
          },
          last_token: { isVisible: false },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } }
        }
      }
    },
    {
      resource: db.Voucher,
      options: {
        actions: {
          edit: {
            isVisible: false
          },
          new: {
            isVisible: false
          }
        },
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } }
        }
      }
    }
  ]
}
AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro(adminBroOptions);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  async authenticate(email, password) {
    const user = await db.Account.findOne({ where: { email: email } });
    if (!user) { return null }
    if (! await user.verifyPassword(password)) { return null }
    return { 'email': user.email };
  },
  cookieName: 'adminbro',
  cookiePassword: process.env.SECRET_KEY
}, null, {
  store: sessionStore
});

module.exports = router
