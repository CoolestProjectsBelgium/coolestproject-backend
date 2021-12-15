'use strict';
const DBA = require('./dba');
const models = require('./models');
const express = require('express');
const app = express();
var exphbs  = require('express-handlebars');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const serverPort = process.env.PORT || 8080;
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

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'website', 'views'));

const corsOptions = {
  origin: process.env.URL,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

// secure routes
require('./security')(app);

// website integration 
const websiteIntegration = require('./website');
app.use('/website', websiteIntegration);

// enable admin UI
const adminUI = require('./admin');
app.use('/admin', adminUI);

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
        const body = JSON.parse(args[0]);
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

initialize({
  app,
  docsPath: '/docs',
  dependencies: {
    database: new DBA(models, Azure),
    models: models,
    mailer: Mailer,
    jwt: Token,
    azure: Azure
  },
  promiseMode: true,
  paths: path.resolve(__dirname, 'paths'),
  apiDoc: {
    ...yaml.load(fs.readFileSync(path.resolve(__dirname, './api/swagger.yaml'), 'utf8')),
    'x-express-openapi-additional-middleware': [validateAllResponses],
    'x-express-openapi-validation-strict': true
  },
  errorMiddleware: function(err, req, res, next) {
    res.status(500);
    res.json({'code': '000', 'message': 'aaa'});
    console.log(err);
  }
});

app.listen(serverPort);
