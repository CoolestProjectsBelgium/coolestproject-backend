'use strict';

const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
AdminBro.registerAdapter(AdminBroSequelize)

const AdminBroExpress = require('admin-bro-expressjs')
const express = require('express')
const app = express()

const db = require('./models');

const reportParent = {
  name: 'Reporting',
  icon: 'fa fa-stream',
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
        actions: {
          new: {
            isVisible: false
          }
        },
        properties: {
          internalp: { type: 'richtext' },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          internalp: { type: 'richtext' }
        }
      } 
    },
    { 
      resource: db.User, 
      options: {
        properties: {
          via: { type: 'richtext' },
          medical: { type: 'richtext' },
          internalu: { type: 'richtext' },
          last_token: { isVisible: false },
          id: { isVisible: { list: false } },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
         /* photo_allowed: {
            components: {
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
const adminBro = new AdminBro(adminBroOptions)

const router = AdminBroExpress.buildRouter(adminBro)

// var serverPort = process.env.PORT || 8081;
var serverPort = process.env.PORT || 3001;


const basicAuth = require('express-basic-auth')

var userList = {};
userList[process.env.ADMIN_USER] = process.env.ADMIN_PWD;

app.use('/admin', basicAuth({
    users: userList,
    challenge: true,
    realm: 'Admin stuff'
}));
app.use(adminBro.options.rootPath, router)
app.listen(serverPort, () => console.log('Running server'))