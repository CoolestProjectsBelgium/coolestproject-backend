'use strict';

var utils = require('../utils/writer.js');
var Attachment = require('../service/AttachmentService');

module.exports.attachmentPOST = function attachmentPOST(req, res, next) {
  const user = req.user;
  const attachment = req.swagger.params['attachment'].value;
  Attachment.attachmentPOST(attachment, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });

};
module.exports.attachmentPOSTSAS = function attachmentPOSTSAS(req, res, next) {
  const user = req.user;
  const name = req.swagger.params['name'].value;
  Attachment.attachmentPOSTSAS(name, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });

};
module.exports.attachmentDELETE = function attachmentDELETE(req, res, next) {
  const user = req.user;
  const name = req.swagger.params['name'].value;
  Attachment.attachmentDELETE(user, name)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};