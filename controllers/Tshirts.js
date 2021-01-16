'use strict';

var utils = require('../utils/writer.js');
var Tshirts = require('../service/TshirtService');

module.exports.tshirtGET = function tshirtGET(req, res, next) {
  const l = req.language;
  Tshirts.tshirtGET(l)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
