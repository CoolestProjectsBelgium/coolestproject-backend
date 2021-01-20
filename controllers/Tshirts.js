'use strict';

var utils = require('../utils/writer.js');
var Tshirts = require('../service/TshirtService');

module.exports.tshirtGET = function tshirtGET(req, res, next) {
  const l = req.language;
  const user = req.user
  Tshirts.tshirtGET(l, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
