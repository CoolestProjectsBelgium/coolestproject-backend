'use strict';

var utils = require('../utils/writer.js');
var Participant = require('../service/ParticipantService');

module.exports.participantPOST = function participantPOST(req, res, next) {
  const user = req.user;
  Participant.participantPOST(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

