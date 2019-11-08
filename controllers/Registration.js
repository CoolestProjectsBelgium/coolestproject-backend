'use strict';

var utils = require('../utils/writer.js');
var Registration = require('../service/RegistrationService');

module.exports.registerPOST = function registerPOST (req, res, next) {
  var user = req.swagger.params['user'].value;
  Registration.registerPOST(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
