'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

/*
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
*/
module.exports.userinfoGET = function userinfoGET (req, res, next) {
  var loginToken = req.headers.api_key;
  User.userinfoGET(loginToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userinfoPATCH = function userinfoPATCH (req, res, next) {
  var loginToken = req.headers.api_key;
  var user = req.swagger.params['user'].value;
  User.userinfoPATCH(loginToken, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userinfoDELETE = function userinfoDELETE (req, res, next) {
  var loginToken = req.headers.api_key;
  User.userinfoDELETE(loginToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};