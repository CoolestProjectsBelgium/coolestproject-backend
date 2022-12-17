'use strict';

const DBA = require('./dba');
const models = require('./models');
const express = require('express');
const app = express();

const session = require("express-session");

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

var exphbs  = require('express-handlebars');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const FunctionalError = require('./utils/FunctionalError');

const requestLanguage = require('express-request-language');



const Token = require('./jwts');
const Mailer = require('./mailer');
const Azure = require('./azure');

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

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'website', 'views'));


var whitelist = [process.env.BACKENDURL, process.env.URL, process.env.VOTE_URL]
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions));



// website integration 
const websiteIntegration = require('./website');
app.use('/website', websiteIntegration);

//sms voting
const smsIntegration = require('./sms');
app.use('/sms', smsIntegration);

//admin voting
const votingIntegration = require('./voting');
app.use('/voting', votingIntegration);

// enable admin UI
const adminUI = require('./admin');
app.use('/admin', adminUI);

// secure routes
require('./security')(app);

//enable i18n
const i18n = require('i18n');
i18n.configure({
  locales: ['en', 'nl', 'fr'],
  directory: __dirname + '/locales'
});

const { initialize } = require('express-openapi');
const yaml = require('js-yaml');

function validateAllResponses(req, res, next) {
  const strictValidation = req.apiDoc['x-express-openapi-validation-strict'] ? true : false;
  if (typeof res.validateResponse === 'function') {
      const send = res.send;
      res.send = function expressOpenAPISend(...args) {
        const onlyWarn = !strictValidation;
        if (res.get('x-express-openapi-validation-error-for') !== undefined) {
            return send.apply(res, args);
        }
        // just ignore incorrect json
        let body = args[0];
        try {
          body = JSON.parse(args[0]);
        } catch (error) {}
        
        let validation = res.validateResponse(res.statusCode, body);
        let validationMessage;
        if (validation === undefined) {
            validation = { message: undefined, errors: undefined };
        }
        if (validation.errors) {
            const errorList = Array.from(validation.errors).map(_ => _.message).join(',');
            validationMessage = `Invalid response for status code ${res.statusCode}: ${errorList}`;
            console.warn(validationMessage);
            // Set to avoid a loop, and to provide the original status code
            res.set('x-express-openapi-validation-error-for', res.statusCode.toString());
        }
        if (onlyWarn || !validation.errors) {
            return send.apply(res, args);
        } else {
            res.status(500);
            return res.json({ error: validationMessage });
        }
    }
  }
  next();
}

function cleanResponse(req, res, next) {
  const send = res.send;

  /* remove null values for api calls */
  function cleanup(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      } else if (typeof obj[propName] === "object") {
        cleanup(obj[propName])
      }
    }
    return obj;
  }

  res.send = function(...args){
    const arg_changed = args;
    if(arg_changed[0]){
      console.log(arg_changed[0])
      const content = JSON.parse(arg_changed[0]);
      arg_changed[0] = JSON.stringify(cleanup(content));
    }
    return send.apply(res, arg_changed);
  }
  next();
}

initialize({
  app,
  docsPath: '/docs',
  dependencies: {
    database: new DBA(Azure),
    models: models,
    mailer: Mailer,
    jwt: Token,
    azure: Azure
  },
  promiseMode: true,
  paths: path.resolve(__dirname, 'paths'),
  apiDoc: {
    ...yaml.load(fs.readFileSync(path.resolve(__dirname, './api/swagger.yaml'), 'utf8')),
    'x-express-openapi-additional-middleware': [validateAllResponses, cleanResponse],
    'x-express-openapi-validation-strict': true
  },
  consumesMiddleware: {
    'application/json': bodyParser.json(),
    'text/text': bodyParser.text()
  },
  errorMiddleware: function(err, req, res, next) {
    console.log(err);

    const language = req.language || 'en';
    i18n.setLocale(language);

    let message = 'INTERNAL_SERVER_ERROR';
    let no = '000';
    if(err instanceof FunctionalError){
        no = '001';
        message = err.message;
    }

    res.status(500);
    res.json({'code': no, 'message':  i18n.__(message)});
  }
});

module.exports = app;