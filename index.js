'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const serverPort = process.env.PORT || 8080;
const requestLanguage = require('express-request-language');

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(requestLanguage({
  languages: ['en', 'fr', 'nl'],
  cookie: {
    name: 'language',
    options: { 
      maxAge: 24 * 3600 * 1000, 
      domain: process.env.DOMAIN_COOKIE, 
      sameSite: 'lax' 
    }
  }
}));

const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

// secure routes
require('./security')(app);

// enable admin UI
const adminUI = require('./admin');
app.use('/admin', adminUI);

//enable i18n
const i18n = require('i18n');
i18n.configure({
  locales: ['en', 'nl', 'fr'],
  directory: __dirname + '/locales'
});

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
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
