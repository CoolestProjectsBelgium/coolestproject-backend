const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('admin-bro-expressjs');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('../models');
const AzureBlob = db.AzureBlob;
const Attachment = db.Attachment;
var DBA = require('../dba');
const Azure = require('../azure');
const sequelize = db.sequelize;
const sessionStore = new SequelizeStore({ db: sequelize });
var stream = require('stream');
var Mail = require('../mailer');
const Token = require('../jwts');

const projectParent = {
  name: 'Projects',
  icon: 'Roadmap'
}

const reportParent = {
  name: 'Reporting',
  icon: 'fa fa-stream',
}

const internalParent = {
  name: 'Internal',
  icon: 'fa fa-exclamation-triangle',
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
  locale: {
    translations: {
      labels: {
        ShowUserWithNoProject: 'Show User(s) With No Project',
        CountTshirtSizes: 'Count Tshirt Sizes',
        ShowAttachmentLoaded: 'Show Attachment(s) Loaded' 
      }
    }
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
        listProperties: ['id', 'event_title','current', 'startDate','maxVoucher','t_proj','maxRegistration','minAge',
                        'maxAge','minGuardianAge','days_remaining','overdue_registration','t_users','pending_user','waiting_list'],
        properties:{
          event_title: {
            isTitle:true,
            label: 'event' 
          }
        },
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
      resource: db.QuestionTranslation,
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
      resource: db.TShirtGroupTranslation,
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
      resource: db.TShirtTranslation,
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
            isVisible: true
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
          internalinfo: { type: 'richtext' }
          // createdAt: { isVisible: { list: false } },
          // updatedAt: { isVisible: { list: false } }
        }
      }
    },

    {
      resource: db.QuestionRegistration,
      options: {
        navigation: projectParent
      }
    },
    {
      resource: db.Project,
      options: {
        navigation: projectParent,
        properties: {
          internalinfo: { type: 'richtext' },
            project_name: {
              isTitle:true,
              label: 'project' 
            }
        }
      }
    },
    {
      resource: db.User,
      options: {
        navigation: projectParent,
        properties: {
          internalinfo: { type: 'richtext'}
        }
      }
    },
    {
      resource: db.QuestionUser,
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
      resource: db.AzureBlob,
      options: {
        navigation: projectParent
      },
      actions: {
        new: {
          isVisible: false
        },
        edit: {
          isVisible: false
        },
        viewAction: {
          actionType: 'record',
          label: 'View blob',
          icon: 'fas fa-play32',
          isVisible: true,
          handler: async (request, response, data) => {
            if (!request.params.recordId || !data.record) {
              throw new NotFoundError([
                'You have to pass "recordId" to View Action',
              ].join('\n'), 'Action#handler');
            }
            try {
              //get blob record
              const blob = await AzureBlob.findByPK(request.params.recordId, { include : [ { model: Attachment } ] } );
              const sas = Azure.generateSAS(blob.blob_name, 'r', blob.Attachment.filename, process.env.BACKENDURL)
              console.log(`SAS token was generated ${sas}`);
              //console.log(sas);
              return {  
                redirectUrl: sas 
              };
            } catch (error) {
              return {
                record: data.record.toJSON(data.currentAdmin),
                notice: {
                  message: error,
                  type: 'error',
                },
              }
            }
          },
          component: false,
        }
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
      resource: db.ShowUserWithNoProject, 
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
      resource: db.CountTshirtSizes, 
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
      resource: db.ShowAttachmentLoaded,
      options: {
        name: "Alle geladen projecten",
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
              // TODO add wrong implementation error
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
