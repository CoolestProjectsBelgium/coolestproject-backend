'use strict';

var models = require('../models');

const Registration = models.Registration;

/**
 * Create new registration
 *
 * user RegistrationRequest The user to create. (optional)
 * no response value expected for this operation
 **/
exports.registerPOST = function(user) {
  return new Promise(function(resolve, reject) {
    Registration.create(user).then(user => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}
