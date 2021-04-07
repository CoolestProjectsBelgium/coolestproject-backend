'use strict';

var utils = require('../utils/writer.js');
var Approvals = require('../service/ApprovalService');

module.exports.approvalGET = function approvalGET(req, res, next) {
  const l = req.language || null;
  const user = req.user || null;
  Approvals.approvalGET(l, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
