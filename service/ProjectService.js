'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

/**
 * Get project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectinfoGET = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info("LoginToken:"+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id:' + token.id);

      var project = await dba.getProject(token.id);
      resolve({
        own_project: token.id === project.ownerId,
        project_name: project.project_name,
        project_descr: project.project_descr,
        project_type: project.project_type,
        project_lang: project.project_lang
      });

    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  });
}