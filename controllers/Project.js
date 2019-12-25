'use strict';

var utils = require('../utils/writer.js');
var Project = require('../service/ProjectService');

/*
module.exports.participantsDELETE = function participantsDELETE (req, res, next) {
  var projectId = req.swagger.params['projectId'].value;
  var userId = req.swagger.params['userId'].value;
  Project.participantsDELETE(projectId,userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.participantsPOST = function participantsPOST (req, res, next) {
  var projectId = req.swagger.params['projectId'].value;
  var voucher = req.swagger.params['voucher'].value;
  Project.participantsPOST(projectId,voucher)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.projectDELETE = function projectDELETE (req, res, next) {
  var projectId = req.swagger.params['projectId'].value;
  Project.projectDELETE(projectId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.projectGET = function projectGET (req, res, next) {
  var projectId = req.swagger.params['projectId'].value;
  Project.projectGET(projectId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.projectPATCH = function projectPATCH (req, res, next) {
  var projectId = req.swagger.params['projectId'].value;
  Project.projectPATCH(projectId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.projectPOST = function projectPOST (req, res, next) {
  var project = req.swagger.params['project'].value;
  Project.projectPOST(project)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
*/
module.exports.projectinfoGET = function projectinfoGET (req, res, next) {
  var loginToken = req.headers.api_key;
  Project.projectinfoGET(loginToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
