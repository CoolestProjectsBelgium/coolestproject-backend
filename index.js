'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');

const express = require('express')
var app = express(); //require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = process.env.PORT || 8080;

// begin admin
const AdminBro = require('admin-bro')
const AdminBroSequelize = require('admin-bro-sequelizejs')
AdminBro.registerAdapter(AdminBroSequelize)

const AdminBroExpress = require('admin-bro-expressjs')

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

const basicAuth = require('express-basic-auth')

var userList = {};
userList[process.env.ADMIN_USER] = process.env.ADMIN_PWD;

app.use('/admin', basicAuth({
    users: userList,
    challenge: true,
    realm: 'Admin stuff'
}));

app.use(adminBro.options.rootPath, router)
// end admin

//enable i18n
const i18n = require("i18n")
i18n.configure({
  locales:['en', 'nl', 'fr'],
  directory: __dirname + '/locales'
});

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

});
