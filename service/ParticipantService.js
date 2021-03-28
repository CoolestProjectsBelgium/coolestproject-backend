'use strict';

const logger = require('pino')();
const respondWithCode = require('../utils/writer').respondWithCode;
var dba = require('../dba');

/**
 * Create Voucher for participant
 * returns Voucher
 **/
exports.participantPOST = async function (user) {
  try {
    await dba.createVoucher(user.id);
    return null;
  } catch (ex) {
    logger.error(ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};


