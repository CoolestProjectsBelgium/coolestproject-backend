'use strict';

const logger = require('pino')()
const Token = require('../jwts');
const respondWithCode = require('../utils/writer').respondWithCode
var DBA = require('../dba');
const Mailer = require('../mailer');
const db = require('../models');

/**
 * Get project based on userId
 *
 * userId Integer User id.
 * returns Object project id's with all fields for UI
 **/
async function getProjectDetails(userId) {
  const project = await DBA.getProject(userId);
  if (project == null) {
    return;
  }
  const ownProject = (userId === project.ownerId);
  const maxTokens = project.max_tokens;
  logger.info("participant:" + project);
  var projectResult = {
    project_name: project.project_name,
    project_descr: project.project_descr,
    project_type: project.project_type,
    project_lang: project.project_lang,
    own_project: ownProject,
    participants: [],
    delete_possible: true
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
    projectResult.remaining_tokens = maxTokens - projectResult.participants.length;
  }

  //delete is not possible when there are participants & it's your own project
  projectResult.delete_possible = (ownProject && (assignedTokens === 0)) || !ownProject;

  return projectResult;
}

/**
 * Get project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectinfoGET = function (user) {
  return new Promise(async function (resolve, reject) {
    try {
      resolve(await getProjectDetails(user.id));
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
exports.projectinfoPATCH = function (project_fields, user) {
  return new Promise(async function (resolve, reject) {
    try {
      await DBA.updateProject(project_fields, user.id);
      resolve(await getProjectDetails(user.id));
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
 * create project for existing user
 *
 * returns Project
 **/
exports.projectinfoPOST = function (project_fields, user) {
  return new Promise(async function (resolve, reject) {
    try {
      await DBA.createProject(project_fields, user.id);
      resolve(await getProjectDetails(user.id));
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
exports.projectinfoDELETE = function (user) {
  return new Promise(async function (resolve, reject) {
    try {
      const project = await DBA.getProject(user.id);
      const event = await DBA.getEventActive();
      const deleteSuccess = await DBA.deleteProject(user.id);
      Mailer.deleteMail(user, project, event);

      resolve(deleteSuccess);
    } catch (ex) {
      logger.error(ex);
      reject(new respondWithCode(500, {
        code: 0,
        message: 'Backend error'
      }));
    }
  })
}