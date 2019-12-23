'use strict';


/**
 * delete participant from project
 *
 * projectId Integer projectId.
 * userId Integer userId.
 * no response value expected for this operation
 **/
exports.participantsDELETE = function(projectId,userId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Add new participant to project
 *
 * projectId Integer projectid.
 * voucher Voucher  (optional)
 * no response value expected for this operation
 **/
exports.participantsPOST = function(projectId,voucher) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * delete project
 *
 * projectId Integer projectId.
 * no response value expected for this operation
 **/
exports.projectDELETE = function(projectId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectGET = function(projectId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "project_type" : "project_type",
  "unused_vouchers" : 0,
  "project_id" : 6,
  "project_lang" : "nl",
  "project_name" : "project_name",
  "project_descr" : "project_descr",
  "participants" : [ null, null ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * update project based on id
 *
 * projectId Integer projectid.
 * returns Project
 **/
exports.projectPATCH = function(projectId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "project_type" : "project_type",
  "unused_vouchers" : 0,
  "project_id" : 6,
  "project_lang" : "nl",
  "project_name" : "project_name",
  "project_descr" : "project_descr",
  "participants" : [ null, null ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create new project
 *
 * project Project  (optional)
 * returns Project
 **/
exports.projectPOST = function(project) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "project_type" : "project_type",
  "unused_vouchers" : 0,
  "project_id" : 6,
  "project_lang" : "nl",
  "project_name" : "project_name",
  "project_descr" : "project_descr",
  "participants" : [ null, null ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

