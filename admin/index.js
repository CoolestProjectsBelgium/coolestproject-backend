const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('admin-bro-expressjs');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('../models');
var DBA = require('../dba');
const sequelize = db.sequelize;
const sessionStore = new SequelizeStore({ db: sequelize });
var stream = require('stream');
var Mail = require('../mailer');
const Token = require('../jwts');

const projectParent = {
  name: 'Projects',
  icon: 'Roadmap'
}

const eventParent = {
  name: 'Event Settings',
  icon: 'Events'
}

const registerParent = {
  name: 'Website Registrations',
  icon: 'Flow'
}

const votingParent = {
  name: 'Voting',
  icon: 'Event'
}

const planningParent = {
  name: 'On-site Planning',
  icon: 'Location'
}

const adminParent = {
  name: 'Administration',
  icon: 'Identification'
}

const adminBroOptions = {
  databases: [db],
  rootPath: '/admin',
  dashboard: {
    handler: async () => {
      const evt = await DBA.getEventActive()
      return evt
    },
    component: AdminBro.bundle('./components/dashboard')
  },
  branding: {
    companyName: 'Coolest Projects',
  },
  resources: [
    {
      resource: db.Session,
      options: {
        navigation: adminParent
      }
    },
    {
      resource: db.Account,
      options: {
        navigation: adminParent
      }
    },
    {
      resource: db.Event,
      options: {
        navigation: eventParent,
        actions: {
          setActive: {
            icon: 'View',
            actionType: 'record',
            component: false,
            handler: async (request, response, data) => {
              const { record, resource, currentAdmin, h } = data
              try {
                const evt = await DBA.setEventActive(request.params.recordId)
                return {
                  record: record.toJSON(currentAdmin),
                  redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                  notice: {
                    message: `Event ${evt.id} is active`,
                    type: 'success',
                  },
                }
              } catch (error) {
                throw error
              }
            }
          }
        }
      }
    },
    {
      resource: db.Question,
      options: {
        navigation: registerParent
      }
    },
    {
      resource: db.TShirtGroup,
      options: {
        navigation: registerParent
      }
    },
    {
      resource: db.TShirt,
      options: {
        navigation: registerParent
      }
    },
    {
      resource: db.QuestionUser,
      options: {
        navigation: registerParent
      }
    },
    {
      resource: db.Registration,
      options: {
        navigation: projectParent,
        actions: {
          new: {
            isVisible: false
          },
          mailAction: {
            actionType: 'record',
            label: 'Resend confirmation mail',
            icon: 'fa-envelope',
            isVisible: true,
            handler: async (request, response, data) => {
              if (!request.params.recordId || !data.record) {
                throw new NotFoundError([
                  'You have to pass "recordId" to Mail Action',
                ].join('\n'), 'Action#handler');
              }
              try {
                const registration = await DBA.getRegistration(request.params.recordId);
                const event = await registration.getEvent();
                const token = await Token.generateRegistrationToken(registration.id);
                const mail = await Mail.activationMail(registration, token, event);
                console.log(`Mail was send ${mail}`);
                //console.log(mail);
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
                notice: {/*  */
                  message: 'Re-registration mail sent',
                  type: 'success',
                },
              }
            },
            component: false,
          }
        },
        properties: {
          // createdAt: { isVisible: { list: false } },
          // updatedAt: { isVisible: { list: false } }
        }


      }
    },
    {
      resource: db.Project,
      options: {
        navigation: projectParent
      }
    },
    {
      resource: db.User,
      options: {
        navigation: projectParent
      }
    },
    {
      resource: db.Voucher,
      options: {
        navigation: projectParent
      }
    },
    {
      resource: db.Attachment,
      options: {
        navigation: projectParent
      }
    },
    {
      resource: db.Vote,
      options: {
        navigation: votingParent
      }
    },
    {
      resource: db.VoteCategory,
      options: {
        navigation: votingParent
      }
    },
    {
      resource: db.ExternVote,
      options: {
        navigation: votingParent
      }
    },
    {
      resource: db.Award,
      options: {
        navigation: votingParent
      }
    },
    {
      resource: db.Table,
      options: {
        navigation: planningParent
      }
    },
    {
      resource: db.ProjectTable,
      options: {
        navigation: planningParent,
        actions: {
          new: {
            actionType: 'resource',
            handler: async (request, response, context) => {
              const { resource, h, currentAdmin, translateMessage } = context
              if (request.method === 'post') {
                let record = await resource.build(request.payload ? request.payload : {})

                await resource.create(record.params)

                if (record.isValid()) {
                  return {
                    redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                    notice: {
                      message: translateMessage('successfullyCreated', resource.id()),
                      type: 'success',
                    },
                    record: record.toJSON(currentAdmin),
                  }
                }
                return {
                  record: record.toJSON(currentAdmin),
                  notice: {
                    message: translateMessage('thereWereValidationErrors', resource.id()),
                    type: 'error',
                  },
                }
              }
              // TODO: add wrong implementation error
              throw new Error('new action can be invoked only via `post` http method')
            },
          }
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
