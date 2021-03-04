'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;
var dba = require('../dba');

/**
 * Create Attachment for attachment
 * returns Attachment
 **/
exports.attachmentPOST = async function (user) {
  try {
    return await dba.createAttachment(user.id);
  } catch (ex) {
    console.error(ex);
    throw respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * Create Attachment for attachment
 * returns Attachment
 **/
exports.attachmentDELETE = async function (user, attachment) {
  try {
    await dba.deleteAttachment(user.id, attachment);
  } catch (ex) {
    throw respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};


