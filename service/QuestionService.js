'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.questionGET = async function (language, user) {
  try {
    let event = null;
    if(user){
      event = user.getEvent();
    } else {
      event = await DBA.getEventActive();
    }
    return await DBA.getQuestions(language.substring(0, 2), event);
  } catch (error) {
    console.log(error);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};