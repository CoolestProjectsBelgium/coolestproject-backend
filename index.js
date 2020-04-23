'use strict';

const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');
const http = require('http');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const serverPort = process.env.PORT ||8080;

//
//const BasicStrategy = require('passport-http').BasicStrategy;

//const session = require("express-session");
//
//const SequelizeStore = require('connect-session-sequelize')(session.Store);
//const Sequelize = require('sequelize');

const models = require('./models');
//const sequelize = models.sequelize;

const Account = models.Account

/*
const sessionStore = new SequelizeStore({db: sequelize});

app.use(express.static("public"));
app.use(session({ secret: process.env.SECRET_KEY, cookie: { secure: true }, maxAge:null, store: sessionStore, resave: false, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(async function(username, done) {
  try {
    const user = await Account.findOne({ where: { username: username }});
    if (!user) { return done(null, false); }
    if (!user.verifyPassword(password)) { return done(null, false); }
    done(null, user);
  } catch(err) {
    return done(err);
  }
});

passport.use(new BasicStrategy(
  async function(username, password, done) {
    try {
      const user = await Account.findOne({ where: { username: username }});
      if (!user) { return done(null, false); }
      console.log("conslog:"+password);
      //if (!user.verifyPassword(password)) { return done(null, false); }
      done(null, user);
    } catch(err) {
      return done(err);
    }
  }
));

app.use('/admin', passport.authenticate('basic', {}));

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const passport = require('passport');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromBodyField("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log("conslog:"+jwt_payload);
  return done(null, {});
}));

app.use('/userinfo', function(req, res, next) {
  passport.authenticate('jwt', {session: false}, function(err, user, info) {
    console.log("conslog:"+jwt_payload);
    if (err) return next(err);
    next();
  })(req, res, next);
});

app.use('/participants', function(req, res, next) {
  passport.authenticate('jwt', {session: false}, function(err, user, info) {
    if (err) return next(err);
    next();
  })(req, res, next);
});

app.use('/projectinfo', function(req, res, next) {
  passport.authenticate('jwt', {session: false}, function(err, user, info) {
    if (err) return next(err);
    next();
  })(req, res, next);
});

app.use(passport.initialize());
*/
app.get('/download', function (req, res) {
  res.setHeader('Content-Disposition','attachment; filename="text.txt"');
  res.send('hello world');
  res.sendStatus(200);
})

// website integration 
const websiteIntegration = require('./website');
app.use('/website', websiteIntegration);


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
