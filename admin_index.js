'use strict';

const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
AdminBro.registerAdapter(AdminBroSequelize)

const AdminBroExpress = require('admin-bro-expressjs')
const express = require('express')
const app = express()

const db = require('./models');
const adminBroOptions = {
  databases: [db],
  rootPath: '/admin',
  branding: {
    companyName: 'Coolest Projects',
  },
  resources: [
    { 
      resource: db.Voucher, 
      options: {
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } }
        }
      } 
    },
    { 
      resource: db.Project, 
      options: {
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
        }
      } 
    },
    { 
      resource: db.Registration, 
      options: {
        properties: {
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          mandatory_approvals: { isVisible: false },
          general_questions: { isVisible: false }
        }
      } 
    },
    { 
      resource: db.User, 
      options: {
        properties: {
          via: { type: 'richtext' },
          medical: { type: 'richtext' },
          last_token: { isVisible: false },
          id: { isVisible: { list: false } },
          createdAt: { isVisible: { list: false } },
          updatedAt: { isVisible: { list: false } },
          general_questions: { isVisible: false },
          mandatory_approvals: { isVisible: false },
          photo_allowed: {
            components: {
              show: AdminBro.bundle('./admin_components/photos_allowed')
            },
            isVisible: {
              show: true, view: false, edit: false, filter: false,
            }
          }
        }
      } 
    }
  ]
}
const adminBro = new AdminBro(adminBroOptions)

const router = AdminBroExpress.buildRouter(adminBro)

var serverPort = process.env.PORT || 8081;
app.use(adminBro.options.rootPath, router)
app.listen(serverPort, () => console.log('Running server'))