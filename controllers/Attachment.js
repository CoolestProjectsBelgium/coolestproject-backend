'use strict';

var utils = require('../utils/writer.js');
var Attachment = require('../service/AttachmentService');

module.exports.attachmentPOST = function attachmentPOST(req, res, next) {
  /* block on production
  const user = req.user;
  Attachment.attachmentPOST(user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
    */
};
module.exports.attachmentDELETE = function attachmentDELETE(req, res, next) {
  /* block on production
  const user = req.user;
  const attachment = req.swagger.params['attachment'].value;
  Attachment.attachmentDELETE(user, attachment)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
  */
};