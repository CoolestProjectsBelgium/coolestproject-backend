'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.questionGET = async function (language) {
  try {
    const questions = await DBA.getQuestions(language.substring(0, 2));
    return questions;
  } catch (error) {
    console.log(error);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};