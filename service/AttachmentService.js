'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;
var dba = require('../dba');

/**
 * Create Attachment for attachment
 * returns Attachment
 **/
exports.attachmentPOST = async function (attachment_fields, user) {
  try {
    return await dba.createAttachment(attachment_fields, user.id);
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
exports.attachmentPOSTSAS = async function (name, user) {
  try {
    return await dba.getAttachmentSAS(name, user.id);
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
exports.attachmentDELETE = async function (user, name) {
  try {
    await dba.deleteAttachment(user.id, name);
  } catch (ex) {
    throw respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};


