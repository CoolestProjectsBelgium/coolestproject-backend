import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import express from 'express'
import * as AdminJSSequelize from '@adminjs/sequelize'

import { models } from './models/index.js'

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

const PORT = 3000

async function start() {
  const app = express()

  console.log(models)

  const adminOptions = {
    resources: [models.Event, models.Account],
  }
  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()