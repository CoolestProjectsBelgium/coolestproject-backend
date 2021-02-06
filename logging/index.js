/*'use strict';

const insights = require('pino-applicationinsights');
const pinoms = require('pino-multi-stream');

const writeStream = await insights.createWriteStream();

const logger = pinoms({ streams: [{stream: writeStream }] })

module.exports = logger;*/