'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.approvalGET = async function (l) {
  try {
    return await DBA.getApprovals(l);
  } catch (error) {
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};