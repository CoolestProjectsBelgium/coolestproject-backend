const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
AdminBro.registerAdapter(AdminBroSequelize)

const AdminBroExpress = require('admin-bro-expressjs')
const express = require('express')
const app = express()

const db = require('./models');
const adminBro = new AdminBro({
  databases: [db],
  rootPath: '/admin',
  branding: {
    companyName: 'Coolest Projects',
  },
})

const router = AdminBroExpress.buildRouter(adminBro)

var serverPort = process.env.PORT || 8080;
app.use(adminBro.options.rootPath, router)
app.listen(serverPort, () => console.log('Running server'))