'use strict';

var utils = require('../utils/writer.js');
var Registration = require('../service/RegistrationService');

module.exports.registerPOST = function registerPOST (req, res, next) {
  var registration = req.swagger.params['registration'].value;
  Registration.registerPOST(registration)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
