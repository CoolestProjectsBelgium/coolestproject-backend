'use strict';

var utils = require('../utils/writer.js');
var Project = require('../service/ProjectService');

module.exports.projectinfoPATCH = function projectinfoPATCH(req, res, next) {
  const user = req.user
  const project = req.swagger.params['project'].value;
  Project.projectinfoPATCH(project, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.projectinfoPOST = function projectinfoPOST(req, res, next) {
  const user = req.user
  const project = req.swagger.params['project'].value;
  Project.projectinfoPOST(project, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.projectinfoDELETE = function projectinfoDELETE(req, res, next) {
  const user = req.user
  Project.projectinfoDELETE(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.projectinfoGET = function projectinfoGET(req, res, next) {
  const user = req.user
  Project.projectinfoGET(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
