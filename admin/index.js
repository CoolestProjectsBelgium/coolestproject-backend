const AdminBro = require('admin-bro');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const AdminBroExpress = require('admin-bro-expressjs');
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('../models');
const AzureBlob = db.AzureBlob;
const Attachment = db.Attachment;
const ProjectTable = db.ProjectTable;
const Voucher = db.Voucher;
const User = db.User
const Project = db.Project
const Hyperlink = db.Hyperlink
var DBA = require('../dba');
const Azure = require('../azure');
const database = new DBA(Azure);
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
      const evt = await database.getEventActive()
      console.log(evt);
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
      resource: db.Sessions,
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
        //listProperties: ['id', 'event_title','current', 'startDate','maxVoucher','t_proj','maxRegistration','minAge',
        //                'maxAge','minGuardianAge','days_remaining','overdue_registration','t_users','pending_user','waiting_list'],
        properties:{
          event_title: {
            isTitle:true,
            label: 'event' 
          },
          overdue_registration:{
            list: true,
            show: true
          },
          waiting_list:{
            list: true,
            show: true
          },
          days_remaining:{
            list: true,
            show: true
          },
          total_males:{
            list: true,
            show: true
          },
          total_females:{
            list: true,
            show: true
          },
          total_X:{
            list: true,
            show: true
          },
          tlang_nl:{
            list: true,
            show: true
          },
          tlang_fr:{
            list: true,
            show: true
          },
          tlang_en:{
            list: true,
            show: true
          },
          tcontact:{
            list: true,
            show: true
          },
          tphoto:{
            list: true,
            show: true
          },
          tclini:{
            list: true,
            show: true
          },
          total_unusedVouchers:{
            list: true,
            show: true
          },
          total_unusedVouchers:{
            list: true,
            show: true
          },
          pending_users:{
            list: true,
            show: true
          },
          total_users:{
            list: true,
            show: true
          },
          total_videos:{
            list: true,
            show: true
          },
          total_projects:{
            list: true,
            show: true
          },
          current: {
            isDisabled: true,
            type: "boolean"
          },
          closed: {
            isDisabled: true,
            type: "boolean"
          }
        },
        actions: {
          list: {
            after: async (response, request, context) => { 
              response.records = await Promise.all(response.records.map(async (r) => {
                try {
                  const evt = await database.getEventDetail(r.params['id']);
                  const properties = await evt.get({ plain: true });
                  for(let p in properties){
                    r.params[p] = properties[p]; 
                  }
                } catch (error) {
                  console.log(error)
                }
                return r
              }));
              return response
            }
          },
          show: {
            after: async (response, request, context) => {
              try {
                const evt = await database.getEventDetail(response.record.params.id);
                const properties = await evt.get({ plain: true });                
                for(let p in properties){
                  response.record.params[p] = properties[p];
                }
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          },
          syncAzureSettings: {
            actionType: 'record',
            label: 'Sync Azure',
            icon: 'fas fa-envelope',
            component: false,
            handler: async (request, response, data) => {
              const { record, resource, currentAdmin, h } = data
              try {
                const evt = await database.getEventDetail(request.params.recordId);
                await Azure.syncSetting(evt);
                return {
                  record: record.toJSON(currentAdmin),
                  redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                  notice: {
                    message: `Sync Azure settings for ${evt.id}`,
                    type: 'success',
                  },
                }
              } catch (error) {
                return {
                  record: data.record.toJSON(data.currentAdmin),
                  notice: {
                    message: error,
                    type: 'error',
                  },
                }
              }
            }
          },
          setActive: {
            icon: 'View',
            actionType: 'record',
            component: false,
            handler: async (request, response, data) => {
              const { record, resource, currentAdmin, h } = data
              try {
                const evt = await database.setEventActive(request.params.recordId)
                return {
                  record: record.toJSON(currentAdmin),
                  redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
                  notice: {
                    message: `Event ${evt.id} is active`,
                    type: 'success',
                  },
                }
              } catch (error) {
                return {
                  record: data.record.toJSON(data.currentAdmin),
                  notice: {
                    message: error,
                    type: 'error',
                  },
                }
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
            component: false,
            handler: async (request, response, data) => {
              if (!request.params.recordId || !data.record) {
                throw new NotFoundError([
                  'You have to pass "recordId" to Mail Action',
                ].join('\n'), 'Action#handler');
              }
              try {
                const registration = await database.getRegistration(request.params.recordId);
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
          },
          totalAttachments:{
            list: true,
            show: true,
            filter: false
          },
          totalAzureBlobs:{
            list: true,
            show: true,
            filter: false
          },
          videoConfirmed:{
            list: true,
            show: true,
            filter: false,
            type: 'boolean'
          },
          videoConfirmedId:{
            list: true,
            show: true,
            filter: false,
          },
          confirmedHref:{
            list: true,
            show: true,
            filter: false
          }
        },
        actions: {
          list: {
            after: async (response, request, context) => {              
              response.records = await Promise.all(response.records.map(async (r) => {
                try {
                  const attachments = await Attachment.findAndCountAll({ includes: [{ model: AzureBlob, includes:[Hyperlink] }], where: {'projectId': r.params['id'] }})
                  r.params.totalAttachments = attachments.count

                  let successCount = 0;
                  let confirmed = false;
                  let confirmedId = -1;
                  let confirmedHref = '';
                  for(let a of attachments.rows){
                    successCount += (await Azure.checkBlobExists((await a.getAzureBlob())?.get('blob_name'))) ? 1 : 0;
                    if(a.get('confirmed')){
                      confirmed = true
                      confirmedId = a.get('id')
                      confirmedHref = (await a.getHyperlink())?.get('href')
                    }
                  }
                  r.params.totalAzureBlobs = successCount
                  r.params.videoConfirmed = confirmed
                  r.params.confirmedHref = confirmedHref
                  r.params.videoConfirmedId = confirmedId
                } catch (error) { 
                  console.log(error)
                }
                return r
              }));
              return response
            }
          },
          show: {
            after: async (response, request, context) => {
              try {
                const attachments = await Attachment.findAndCountAll({ includes: [{ model: AzureBlob, includes:[Hyperlink] }], where: {'projectId': response.record.params.id }})  
                response.record.params.totalAttachments = attachments.count
                
                let successCount = 0;
                let confirmed = false;
                let confirmedId = -1;
                let confirmedHref = '';
                for(let a of attachments.rows){         
                  successCount += (await Azure.checkBlobExists((await a.getAzureBlob())?.get('blob_name'))) ? 1 : 0;
                  if(a.get('confirmed')){
                    confirmed = true
                    confirmedId = a.get('id')
                    confirmedHref = (await a.getHyperlink())?.get('href')
                  }
                }
                response.record.params.totalAzureBlobs = successCount
                response.record.params.videoConfirmed = confirmed
                response.record.params.videoConfirmedId = confirmedId
                response.record.params.confirmedHref = confirmedHref         
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          }
        }
      }
    },
    {
      resource: db.User,
      options: {
        navigation: projectParent,
        properties: {
          internalinfo: { type: 'richtext'},
          isOwner:{
            list: true,
            show: true,
            filter: false,
            type: 'boolean'
          },
          isParticipant:{
            list: true,
            show: true,
            filter: false,
            type: 'boolean'
          },
          hasProject:{
            list: true,
            show: true,
            filter: false,
            type: 'boolean'
          }
        },
        actions: {
          list: {
            after: async (response, request, context) => { 
              response.records = await Promise.all(response.records.map(async (r) => {
                try {
                  const owner = await Project.count({ where: { ownerId: r.params['id'] } })
                  const participant = await Voucher.count({ where: { participantId: r.params['id'] } })
                  r.params.isOwner = (owner > 0) ? true : false
                  r.params.isParticipant = (participant > 0)  ? true : false
                  r.params.hasProject = (owner > 0 || participant > 0) ? true : false
                } catch (error) {
                  console.log(error)
                }
                return r
              }));
              return response
            }
          },
          show: {
            after: async (response, request, context) => {
              try {
                const owner = await Project.count({ where: { ownerId: response.record.params.id } })
                const participant = await Voucher.count({ where: { participantId: response.record.params.id } })
                response.record.params.isOwner = (owner > 0) ? true : false
                response.record.params.isParticipant = (participant > 0)  ? true : false
                response.record.params.hasProject = (owner > 0 || participant > 0) ? true : false
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          }
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
      resource: db.Certificate,
      options: {
        navigation: projectParent,
        properties: {
          text: { type: 'richtext' }
        }
      }
    },
    {
      resource: db.Attachment,
      options: {
        navigation: projectParent,
        properties: { 
          id: {
            isTitle: true,
            label: 'id' 
          },
          azureExists: {
            list: true,
            show: true,
            new: false,
            filter: false,
            type: 'boolean'
          },   
          downloadLink: {
            isVisible: {
              list: true,
              show: true,
              new: false,
              filter: false,
            },
            components: {
              list: AdminBro.bundle('./components/file'),
              show: AdminBro.bundle('./components/file'),  
            },  
          }
        },
        actions: {
          new: {
            isVisible: false
          },
          list: {
            after: async (response, request, context) => {       
              response.records = await Promise.all(response.records.map(async (r) => {
                try { 
                  const attachment = await Attachment.findByPk(r.id, { include: [{ model: AzureBlob}] });
                  const sas = await Azure.generateSAS(attachment.AzureBlob.blob_name, 'r', attachment.filename, process.env.BACKENDURL)
                  r.params['downloadLink'] = sas.url
                  r.params['azureExists'] = await Azure.checkBlobExists(attachment.AzureBlob.blob_name);
                } catch (error) {
                  //ignore
                }
                return r
              }));
              return response
            },
          },
          show: {
            after: async (response, request, context) => {
              try {
                const attachment = await Attachment.findByPk(response.record.params.id, { include: [{ model: AzureBlob}] });
                const sas = await Azure.generateSAS(attachment.AzureBlob.blob_name, 'r', attachment.filename, process.env.BACKENDURL)
                response.record.params['downloadLink'] = sas.url
                response.record.params['azureExists'] = await Azure.checkBlobExists(attachment.AzureBlob.blob_name);
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          }
        }
      }
    },
    {
      resource: db.AzureBlob,
      options: {
        navigation: projectParent,  
        properties: {      
          downloadLink: {
            isVisible: {
              list: true,
              show: true,
              new: false,
              filter: false,
            },
            components: {
              list: AdminBro.bundle('./components/file'),
              show: AdminBro.bundle('./components/file'),  
            },  
          },
          azureExists: {
            list: true,
            show: true,
            new: false,
            filter: false,
            type: 'boolean'
          }
        },
        actions: {
          new: {
            isVisible: false
          },
          edit: {
            isVisible: false
          },
          list: {
            after: async (response, request, context) => {       
              response.records = await Promise.all(response.records.map(async (r) => {
                try { 
                  const blob = await AzureBlob.findByPk(r.id, { include: [{ model: Attachment}] });
                  const sas = await Azure.generateSAS(blob.blob_name, 'r', blob.Attachment.filename, process.env.BACKENDURL)
                  r.params['azureExists'] = await Azure.checkBlobExists(blob.blob_name);
                  r.params['downloadLink'] = sas.url
                } catch (error) {
                  //ignore
                }
                return r
              }));
              return response
            },
          },
          show: {
            after: async (response, request, context) => {
              try {
                const blob = await AzureBlob.findByPk(response.record.params.id, { include: [{ model: Attachment}] });
                const sas = await Azure.generateSAS(blob.blob_name, 'r', blob.Attachment.filename, process.env.BACKENDURL)
                response.record.params['downloadLink'] = sas.url
                response.record.params['azureExists'] = await Azure.checkBlobExists(blob.blob_name);
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          },
        }
      }
    }, 
    {
      resource: db.Hyperlink,
      options: {
        navigation: projectParent,
        properties:{
          projectId: {
            list: true,
            show: true,
            new: false,
            filter: false
          },
          projectName: {
            list: true,
            show: true,
            new: false,
            filter: false
          }
        },
        actions: {
          list: {
            after: async (response, request, context) => {       
              response.records = await Promise.all(response.records.map(async (r) => {
                try { 
                  const hyperlink = await Hyperlink.findByPk(r.id, { include: [{ model: Attachment, include: [Project]}] });
                  r.params.projectId = hyperlink.Attachment.ProjectId
                  r.params.projectName = hyperlink.Attachment.Project.project_name
                } catch (error) {
                  //ignore
                }
                return r
              }));
              return response
            },
          },
          show: {
            after: async (response, request, context) => {
              try {
                const hyperlink = await Hyperlink.findByPk(response.record.params.id, { include: [{ model: Attachment, include: [Project]}] });
                response.record.params.projectId = hyperlink.Attachment.ProjectId
                response.record.params.projectName = hyperlink.Attachment.Project.project_name

              } catch (error) {
                console.log(error)
              }
              return response;
            }
          }
        },
      },
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
      resource: db.userprojectvideo, 
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
      resource: db.Table,
      options: {
        navigation: planningParent,
        properties:{
          remainingPlaces: {
            label: 'remaining places' 
          }
        },
        actions: {
          list: {
            after: async (response, request, context) => {
              response.records = await Promise.all(response.records.map(async (r) => {
                try { 
                  const remaining = await ProjectTable.sum('UsedPlaces', {
                    where: {
                      TableId: r.id
                    }
                  });
                  r.params['remainingPlaces'] = r.params.maxPlaces - remaining 
                } catch (error) {
                  console.log(error)
                }
                return r
              }));
              return response
            }
          },
          show: {
            after: async (response, request, context) => {
              try {
                const remaining = await ProjectTable.sum('UsedPlaces', {
                  where: {
                    TableId: response.record.params.id
                  }
                });
                response.record.params['remainingPlaces'] = response.record.params.maxPlaces - remaining 
              } catch (error) {
                console.log(error)
              }
              return response;
            }
          }
        }
      }  
    },
    {
      resource: db.Location,
      options: {
        navigation: planningParent,
        properties:{
          text: {
            isTitle: true,
            label: 'text' 
          }
        }
      }
    },
    {
      resource: db.ProjectTable,
      options: {
        navigation: planningParent,
        actions: {
          switch: {
            actionType: 'record',
            icon: 'Switch',
            isVisible: true,
            handler: async () => {}
          },
          plan: {
            actionType: 'resource',
            icon: 'Plan',
            isVisible: true,
            handler: async () => {}
          },
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
