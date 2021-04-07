'use strict';

var utils = require('../utils/writer.js');
var Settings = require('../service/SettingsService');

module.exports.settingsGET = function settingsGET (req, res, next) {
  const user = req.user || null;
  Settings.settingsGET(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
