'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

const models = require('../models');
const User = models.User;
const Registration = models.Registration;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.settingsGET = async function (user) {
  
  let event = null;
  if(user){
    event = user.getEvent();
  } else {
    event = await DBA.getEventActive();
  }
  
  if (!event) {
    throw new respondWithCode(404, {
      code: 0,
      message: 'No Active event found'
    });
  }
  const registration_count = 
    await User.count({ where: { eventId: event.id }, lock: true }) + await Registration.count({ lock: true });

  return {
    startDateEvent: event.startDate.toISOString().substring(0, 10),
    maxAge: event.maxAge,
    minAge: event.minAge,
    guardianAge: event.minGuardianAge,
    tshirtDate: event.startDate.toISOString().substring(0, 10),
    enviroment: process.env.NODE_ENV,
    waitingListActive: (registration_count >= event.maxRegistration),
    maxUploadSize: event.maxFileSize  || 1024 * 1024 * 1024 * 5, // 5 gigs in bytes
  };
};