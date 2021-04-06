'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.approvalGET = async function (l, user) {
  try {
    let event = null;
    if(user){
      event = await user.getEvent();
    } else {
      event = await DBA.getEventActive();
    }
    return await DBA.getApprovals(l, event);
  } catch (error) {
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};