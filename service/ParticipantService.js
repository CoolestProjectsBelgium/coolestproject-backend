'use strict';

const logger = require('pino')();
const Token = require('../jwts');
const respondWithCode = require('../utils/writer').respondWithCode;
var dba = require('../dba');

/**
 * Create Voucher for participant
 * returns Voucher
 **/
exports.participantPOST = function (user) {
  return new Promise(async function (resolve, reject) {
    try {
      await dba.createVoucher(user.id);
      resolve(null);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  });
};


