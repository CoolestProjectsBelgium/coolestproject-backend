'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

async function getProjectDetails (userId) {
  var project = await dba.getProject(userId);
  logger.info("participant:" + project);
  if (project !== null) {
    var projectResult = {
      project_name: project.project_name,
      project_descr: project.project_descr,
      project_type: project.project_type,
      project_lang: project.project_lang,
      own_project: (userId === project.ownerId),
      participants: []
    }
    // list vouchers & display participants
    project.Vouchers.forEach((voucher) => {
      let line = {}      
      if (voucher.participant) {
        line.name = voucher.participant.firstname + ' ' + voucher.participant.lastname;
      } else {
        line.id = voucher.id;
      }
      projectResult.participants.push(line);
    })
    // owner if you are not the owner
    if (project.owner) {
      projectResult.project_owner = project.owner.firstname + ' ' + project.owner.lastname;
    }
    // count remaining tokens
    projectResult.remaining_tokens = process.env.MAX_VOUCHERS - projectResult.participants.length;

    return projectResult;
  }
}

/**
 * Get project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectinfoGET = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info("LoginToken:" + loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id:' + token.id);
      resolve(getProjectDetails(token.id));
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  });
}

/**
 * update the projectinfo
 *
 * returns Project
 **/
exports.projectinfoPATCH = function(loginToken, project) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      await dba.updateProject(project, token.id);
      resolve(await getProjectDetails(token.id));
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
 * create the projectinfo
 *
 * returns Project
 **/
exports.projectinfoPOST = function(loginToken, project) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      if(project.project_code){
        await dba.addParticipantProject(token.id, project.project_code);
      } else {
        await dba.createProject(project, token.id);
      }
      resolve(await getProjectDetails(token.id));
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
 * delete the projectinfo
 *
 * returns User
 **/
exports.projectinfoDELETE = function(loginToken) {
  return new Promise(async function(resolve, reject) {
    try {
      logger.info('LoginToken: '+loginToken);
      var token = await TokenService.validateToken(loginToken);
      logger.info('user id: ' + token.id);
      var u = await dba.deleteProject(token.id);
      resolve(u);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}