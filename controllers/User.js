'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userinfoGET = function userinfoGET(req, res, next) {
  var logged_in_user = req.user;
  //console.log(req)
  User.userinfoGET(logged_in_user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.userinfoPATCH = function userinfoPATCH(req, res, next) {
  var logged_in_user = req.user;
  var user = req.swagger.params['user'].value;
  User.userinfoPATCH(user, logged_in_user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
module.exports.userinfoDELETE = function userinfoDELETE(req, res, next) {
  var logged_in_user = req.user;
  User.userinfoDELETE(logged_in_user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};