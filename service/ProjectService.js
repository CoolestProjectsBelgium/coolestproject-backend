'use strict';

const respondWithCode = require('../utils/writer').respondWithCode;
var DBA = require('../dba');
const Mailer = require('../mailer');
const Azure = require('../azure');

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
  const projectResult = {
    own_project: {
      project_name: project.project_name,
      project_descr: project.project_descr,
      project_type: project.project_type,
      project_lang: project.project_lang,
      participants: [],
      delete_possible: false,
      own_project: (userId === project.ownerId)
    }
  };

  const ownProject = projectResult.own_project.own_project;
  const maxTokens = project.max_tokens;
  let assignedTokens = 0;

  project.Vouchers.forEach((voucher) => {
    // only show participants to non owners
    if (!ownProject && voucher.participant === null) {
      return;
    }
    let line = {};
    if (voucher.participant) {
      line.name = voucher.participant.firstname + ' ' + voucher.participant.lastname;
      if (userId === voucher.participant.id) {
        line.self = true;
      }
      assignedTokens++;
    } else {
      line.id = voucher.id;
    }
    projectResult.own_project.participants.push(line);
  });

  // owner if you are not the owner
  const ownerUser = await project.getOwner();
  if (ownerUser) {
    projectResult.own_project.project_owner = ownerUser.firstname + ' ' + ownerUser.lastname;
  }
  // count remaining tokens
  if (ownProject) {
    projectResult.own_project.remaining_tokens = maxTokens - projectResult.own_project.participants.length;
  }

  //delete is not possible when there are participants & it's your own project
  projectResult.own_project.delete_possible = (ownProject && (assignedTokens === 0)) || !ownProject;

  //get attachments
  const attachments = [];
  for(const a of await project.getAttachments()){
    if(a.internal){
      continue;
    }
    const blob = await a.getAzureBlob();
    const readSAS = await Azure.generateSAS(blob.blob_name, 'r', a.filename);
    attachments.push({
      id: blob.blob_name,
      name: a.name,
      url: readSAS.url,
      size: blob.size,
      filename: a.filename,
      confirmed: a.confirmed || false
    });
  }
  projectResult.attachments = attachments;

  return projectResult;
}

/**
 * Get project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectinfoGET = async function (user) {
  try {
    return await getProjectDetails(user.id);
  } catch (ex) {
    console.error(ex);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * update the projectinfo
 *
 * returns Project
 **/
exports.projectinfoPATCH = async function (project_fields, user) {
  try {
    // flatten the response
    const ownProject = project_fields.own_project;
    const project = {
      project_name: ownProject.project_name,
      project_descr: ownProject.project_descr,
      project_type: ownProject.project_type,
      project_lang: ownProject.project_lang,
    };
    await DBA.updateProject(project, user.id);
    return await getProjectDetails(user.id);
  } catch (ex) {
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * create project for existing user or add user to project
 *
 * returns Project
 **/
exports.projectinfoPOST = async function (project_fields, user) {
  try {
    const project = {};
    const ownProject = project_fields.own_project;
    const otherProject = project_fields.other_project;

    if (ownProject) {
      // create new project for this user
      project.project_name = ownProject.project_name;
      project.project_descr = ownProject.project_descr;
      project.project_type = ownProject.project_type;
      project.project_lang = ownProject.project_lang;
      await DBA.createProject(project, user.id);
    } else if (otherProject) {
      // add user to voucher
      await DBA.addParticipantProject(user.id, otherProject.project_code);
    }
    return await getProjectDetails(user.id);
  } catch (ex) {
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};

/**
 * delete the projectinfo
 *
 * returns User
 **/
exports.projectinfoDELETE = async function (user) {
  try {
    const project = await DBA.getProject(user.id);
    const event = await user.getEvent();
    const deleteSuccess = await DBA.deleteProject(user.id);
    Mailer.deleteMail(user, project, event);

    return deleteSuccess;
  } catch (ex) {
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};