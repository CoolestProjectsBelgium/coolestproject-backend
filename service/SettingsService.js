'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.settingsGET = async function () {
  const event = await DBA.getEventActive();
  if (!event) {
    throw new respondWithCode(404, {
      code: 0,
      message: 'No Active event found'
    });
  }
  return {
    startDateEvent: event.startDate.toISOString().substring(0, 10),
    maxAge: event.maxAge,
    minAge: event.minAge,
    guardianAge: event.minGuardianAge,
    tshirtDate: event.startDate.toISOString().substring(0, 10),
    enviroment: process.env.NODE_ENV
  };
};