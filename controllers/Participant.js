'use strict';

var utils = require('../utils/writer.js');
var Participant = require('../service/ParticipantService');

module.exports.participantPOST = function participantPOST (req, res, next) {
  var loginToken = req.headers.api_key;
  Participant.participantPOST(loginToken)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

