'use strict';

const logger = require('pino')()
const TokenService = require('./TokenService');
const respondWithCode = require('../utils/writer').respondWithCode
var dba = require('../service/DBService');

async function getProjectDetails (userId) {
  const project = await dba.getProject(userId);
  if (project !== null) {
    const ownProject = (userId === project.ownerId);
    logger.info("participant:" + project);
    var projectResult = {
      project_name: project.project_name,
      project_descr: project.project_descr,
      project_type: project.project_type,
      project_lang: project.project_lang,
      own_project: ownProject,
      participants: [],
      delete_possible: true,
      info: project.info
    }
    // list vouchers & display participants
    var assignedTokens = 0;
    project.Vouchers.forEach((voucher) => {
      // only show participants to non owners
      if (!ownProject && voucher.participant === null) {
        return
      }
      let line = {}      
      if (voucher.participant) {
        line.name = voucher.participant.firstname + ' ' + voucher.participant.lastname;
        if (userId === voucher.participant.id) {
          line.self = true;
        }
        assignedTokens++;
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
    if (ownProject) {
      projectResult.remaining_tokens = process.env.MAX_VOUCHERS - projectResult.participants.length;
    }

    //delete is not possible when there are participants & it's your own project
    projectResult.delete_possible = ( ownProject && (assignedTokens === 0) ) || !ownProject;

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
      resolve(await getProjectDetails(token.id));
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