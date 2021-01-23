'use strict';

const Token = require('../jwts');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../dba');

/**
 * Create Attachment for attachment
 * returns Attachment
 **/
exports.attachmentPOST = function (user) {
  return new Promise(async function (resolve, reject) {
    try {
      await dba.createAttachment(user.id);
      resolve(null);
    } catch (ex) {
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

/**
 * Create Attachment for attachment
 * returns Attachment
 **/
exports.attachmentDELETE = function (user, attachment) {
  return new Promise(async function (resolve, reject) {
    try {
      await dba.deleteAttachment(user.id, attachment);
      resolve(null);
    } catch (ex) {
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}


