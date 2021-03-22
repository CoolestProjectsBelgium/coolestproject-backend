'use strict';

var utils = require('../utils/writer.js');
var Questions = require('../service/QuestionService');

module.exports.questionGET = function questionGET(req, res, next) {
  const l = req.language;
  const user = req.user;
  Questions.questionGET(l, user)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
