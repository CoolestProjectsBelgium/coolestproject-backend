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

const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const dba = require('./dba');
const mail = require('./service/MailService');

// JWT token via passport logic (move outside of swagger implementation)
app.use(passport.initialize());
app.use(passport.session());

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    // user login
    let user = null;
    let participant = null;
    let owner = null;
    if (jwt_payload.id !== null) {
      user = await dba.getUser(jwt_payload.id);

      // create user
    } else if (jwt_payload.registrationId !== null) {

      let userId = -1;
      // get registration
      const registration = await dba.getRegistration(jwt_payload.registrationId);
      // no registration found in our table (already created)
      if (registration === null) {
        return done(null, false);
      }
      if (registration.project_code) {
        // create user and add to existing project
        participant = await dba.createUserWithVoucher(
          {
            language: registration.language,
            postalcode: registration.postalcode,
            email: registration.email,
            gsm: registration.gsm,
            firstname: registration.firstname,
            lastname: registration.lastname,
            sex: registration.sex,
            birthmonth: registration.birthmonth,
            mandatory_approvals: registration.mandatory_approvals,
            t_size: registration.t_size,
            via: registration.via,
            medical: registration.medical,
            gsm_guardian: registration.gsm_guardian,
            email_guardian: registration.email_guardian,
            general_questions: registration.general_questions
          },
          registration.project_code,
          registration.id
        );
        userId = participant.id
      } else {
        // create user with project
        owner = await dba.createUserWithProject(
          {
            language: registration.language,
            postalcode: registration.postalcode,
            email: registration.email,
            gsm: registration.gsm,
            firstname: registration.firstname,
            lastname: registration.lastname,
            sex: registration.sex,
            birthmonth: registration.birthmonth,
            mandatory_approvals: registration.mandatory_approvals,
            t_size: registration.t_size,
            via: registration.via,
            medical: registration.medical,
            gsm_guardian: registration.gsm_guardian,
            email_guardian: registration.email_guardian,
            general_questions: registration.general_questions,
            project: {
              project_name: registration.project_name,
              project_descr: registration.project_descr,
              project_type: registration.project_type,
              project_lang: registration.project_lang
            }
          },
          registration.id
        );
        userId = owner.id;
      }
      // return the newly created user
      user = await dba.getUser(userId);
    }

    // send welcome mails if user is new
    if (owner) {
      mail.welcomeMailOwner(owner);
    } else if (participant) {
      mail.welcomeMailParticipant(participant);
    }

    // check if user is found
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }

  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await dba.getUser(user.id);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// secured by JWT tokens
app.use('/userinfo', passport.authenticate('jwt'))
app.use('/projectinfo', passport.authenticate('jwt'))
app.use('/participants', passport.authenticate('jwt'))

// enable admin UI
const adminUI = require('./admin');
app.use('/admin', adminUI);

//enable i18n
const i18n = require("i18n")
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
