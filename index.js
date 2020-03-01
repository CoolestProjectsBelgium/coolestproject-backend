'use strict';

const app = express();

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const serverPort = process.env.PORT || 8080;
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require("express-session");
const bodyParser = require("body-parser");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Sequelize = require('sequelize');

const models = require('./models');
const sequelize = models.sequelize;

const sessionStore = new SequelizeStore({db: sequelize});

app.use(express.static("public"));
app.use(session({ secret: process.env.SECRET_KEY, cookie: { secure: true }, store: sessionStore}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new BasicStrategy(
  function(username, password, done) {
    return done(null, { 'username': username, 'passport': passport });
  }
));

app.use('/admin', passport.authenticate('basic', { }));

// enable admin UI
const adminUI = require('./admin');
app.use('/admin', adminUI);

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
