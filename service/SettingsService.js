'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.settingsGET = function () {
  return new Promise(async function (resolve, reject) {
    const event = await DBA.getEventActive();
    if (!event) {
      return reject(new respondWithCode(404, {
        code: 0,
        message: 'No Active event found'
      }));
    }
    resolve({
      startDateEvent: event.startDate.toISOString().substring(0, 10),
      maxAge: event.maxAge,
      minAge: event.minAge,
      guardianAge: event.minGuardianAge,
      tshirtDate: event.startDate.toISOString().substring(0, 10),
      enviroment: process.env.NODE_ENV
    });
  });
};