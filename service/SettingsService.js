'use strict';

const logger = require('pino')()
const respondWithCode = require('../utils/writer').respondWithCo

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.settingsGET = function() {
    return new Promise(async function(resolve, reject) {
        resolve({
            startDateEvent: new Date(process.env.START_DATE),
            maxAge: process.env.MAX_AGE || 0,
            minAge: process.env.MIN_AGE || 0,
            guardianAge: process.env.GUARDIAN_AGE || 0,
            tshirtDate: new Date(process.env.TSHIRT_DATE)
        });
    })
}