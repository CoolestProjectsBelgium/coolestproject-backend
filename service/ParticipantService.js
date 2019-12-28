'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

/**
 * update the participant
 *
 * returns Voucher
 **/
exports.participantPOST = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      var v = await dba.createVoucher(token.id);
      resolve(v);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

/**
 * get the participant
 **/
exports.participantGET = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      var v = await dba.getVouchers(token.id);
      resolve(v);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}

