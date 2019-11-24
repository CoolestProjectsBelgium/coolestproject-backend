'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userDELETE = function userDELETE (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  User.userDELETE(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userGET = function userGET (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  User.userGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userPATCH = function userPATCH (req, res, next) {
  var userId = req.swagger.params['userId'].value;
  User.userPATCH(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userinfoGET = function userinfoGET (req, res, next) {
  User.userinfoGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
