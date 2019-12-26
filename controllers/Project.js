'use strict';

var utils = require('../utils/writer.js');
var Project = require('../service/ProjectService');

module.exports.projectinfoPATCH = function projectinfoPATCH (req, res, next) {
  var loginToken = req.headers.api_key;
  var project = req.swagger.params['project'].value;
  Project.projectinfoPATCH(loginToken, project)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.projectinfoPOST = function projectinfoPOST (req, res, next) {
  var loginToken = req.headers.api_key;
  var project = req.swagger.params['project'].value;
  Project.projectinfoPOST(loginToken, project)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.projectinfoDELETE = function projectinfoDELETE (req, res, next) {
  var loginToken = req.headers.api_key;
  Project.projectinfoDELETE(loginToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
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
