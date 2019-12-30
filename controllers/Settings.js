'use strict';

var utils = require('../utils/writer.js');
var Settings = require('../service/SettingsService');

module.exports.settingsGET = function settingsGET (req, res, next) {
  Settings.settingsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
