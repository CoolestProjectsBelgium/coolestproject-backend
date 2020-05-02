const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('admin-bro-expressjs');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('../models');
var dba = require('../service/DBService');
const sequelize = db.sequelize;
const sessionStore = new SequelizeStore({db: sequelize});
var MailService = require('../service/MailService');
var TokenService = require('../service/TokenService');
var stream = require('stream');


const PER_PAGE_LIMIT = 500;

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
            handler: async (request, response, data) => {
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
          internalp: { type: 'richtext' },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          certificate: { type: 'textarea' },
          offset: {},
        }
      } 
    },
    { 
      resource: db.User, 
      options: {
        listProperties: ['email', 'id', 'firstname','lastname','residence','gsm','email_guardian','gsm_guardian'],
        actions: {
          export: {
            actionType: 'resource',
            label: 'Export',
            icon: 'fas fa-file-export',
            isVisible: true,
            handler: async (request, response, data) => {
              return {}
            },
            component: AdminBro.bundle('../admin_components/export'),
          }
        },
        properties: {
          via: { type: 'richtext' },
          medical: { type: 'richtext' },
          internalu: { type: 'richtext' },
          last_token: { isVisible: false },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
         /* photo_allowed: {
            components: {r
              show: AdminBro.bundle('./admin_components/photos_allowed')
            },
            isVisible: {
              show: true, view: false, edit: false, filter: false,
            }
          } */
        }
      } 
    },
    { 
      resource: db.Voucher, 
      options: {
        listProperties: ['id','participantId','projectId'],
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
    },
    { 
      resource: db.useronly, 
      options: {
        name: "Users zonder project of medewerker)",
        listProperties: ['id', 'firstname', 'lastname', 'email'],
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
     { 
      resource: db.UserProjectView, 
      options: {
        name: "Projecten met medewerker",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.UserProjectVideo, 
      options: {
        name: "Alle projecten met youtube link",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.UserProjectViewAll, 
      options: {
        name: "Alle projecten met/zonder medewerker",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.tshirtsizes, 
      options: {
        name: "Aantal T-shirts per maat",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.UserNames, 
      options: {
        name: "Lijst gebruikers voor naam label",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.sex, 
      options: {
        name: "Aantal jongens/meisjes",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    },
    { 
      resource: db.taal, 
      options: {
        name: "Aantal talen",
        parent: reportParent,
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          delete: {
            isVisible: false
          }
        },
        properties: {
        }
      } 
    }
  ]
}
AdminBro.registerAdapter(AdminBroSequelize)

const adminBro = new AdminBro(adminBroOptions);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  async authenticate(email, password) {
    const user = await db.Account.findOne({ where: { email: email }});
    if(!user) { return null }
    if (! await user.verifyPassword(password)) { return null }
    return { 'email': user.email };
  },
  cookieName: 'adminbro',
  cookiePassword: process.env.SECRET_KEY
}, null, {
  store: sessionStore
});

module.exports = router
