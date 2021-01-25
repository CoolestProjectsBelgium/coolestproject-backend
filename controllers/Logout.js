'use strict';

var utils = require('../utils/writer.js');
var Logout = require('../service/LogoutService');

module.exports.logoutPOST = function logoutPOST(req, res, next) {
  const logged_in_user = req.user;
  Logout.logoutPOST(logged_in_user, res)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


