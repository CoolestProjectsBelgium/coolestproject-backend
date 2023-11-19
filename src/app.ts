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
const HOST = '0.0.0.0'

async function start() {
  const app = express()

  //start admin for all previous events
  const events = await models.Event.unscoped().findAll();
  for (const event of events) {
    //remove default scope & trigger specific event scope
    let adminOptions = {
      resources: Object.values(models).map((model) => model.unscoped().scope('event', { method: ['eventId', event.id] })),
    }
    let admin = new AdminJS(adminOptions)
    let adminRouter = AdminJSExpress.buildRouter(admin)
    app.use(admin.options.rootPath + '/' + event.id , adminRouter)
  }

  app.listen(PORT, HOST, () => {
    console.log(`Backend Started`)
  })
}

start()