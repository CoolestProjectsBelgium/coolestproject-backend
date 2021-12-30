'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var cls = require('cls-hooked');

var namespace = cls.createNamespace('coolestproject');

var _require = require('uuid'),
    uuidv4 = _require.v4;

var addYears = require('date-fns/addYears');

var crypto = require('crypto');

var _require2 = require('sequelize'),
    Op = _require2.Op;

var models = require('../models');

var Sequelize = require('sequelize');

Sequelize.useCLS(namespace);

var bcrypt = require('bcrypt');

var Account = models.Account;
var QuestionRegistration = models.QuestionRegistration;
var QuestionUser = models.QuestionUser;
var Project = models.Project;
var Question = models.Question;
var User = models.User;
var Voucher = models.Voucher;
var Event = models.Event;
var TShirt = models.TShirt;
var TShirtGroup = models.TShirtGroup;
var Registration = models.Registration;
var sequelize = models.sequelize;
var QuestionTranslation = models.QuestionTranslation;
var TShirtTranslation = models.TShirtTranslation;
var TShirtGroupTranslation = models.TShirtGroupTranslation;
var Attachment = models.Attachment;
var AzureBlob = models.AzureBlob;

var DBA =
/*#__PURE__*/
function () {
  function DBA(azure) {
    _classCallCheck(this, DBA);

    this.azure = azure;
  }
  /**
     * @param {Integer} registrationId 
     * @returns {Promise<models.User>} created User
     */


  _createClass(DBA, [{
    key: "createUserFromRegistration",
    value: function createUserFromRegistration(registrationId) {
      var _this = this;

      return regeneratorRuntime.async(function createUserFromRegistration$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee() {
                var registration, userId, participant, owner;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(_this.getRegistration(registrationId));

                      case 2:
                        registration = _context.sent;

                        if (!(registration === null)) {
                          _context.next = 5;
                          break;
                        }

                        throw new Error("No registration found for id ".concat(registrationId));

                      case 5:
                        userId = null;

                        if (!registration.project_code) {
                          _context.next = 13;
                          break;
                        }

                        _context.next = 9;
                        return regeneratorRuntime.awrap(_this.createUserWithVoucher({
                          language: registration.language,
                          postalcode: registration.postalcode,
                          email: registration.email,
                          gsm: registration.gsm,
                          firstname: registration.firstname,
                          lastname: registration.lastname,
                          sex: registration.sex,
                          birthmonth: registration.birthmonth,
                          sizeId: registration.sizeId,
                          via: registration.via,
                          medical: registration.medical,
                          gsm_guardian: registration.gsm_guardian,
                          email_guardian: registration.email_guardian,
                          eventId: registration.eventId,
                          street: registration.street,
                          municipality_name: registration.municipality_name,
                          house_number: registration.house_number,
                          box_number: registration.box_number,
                          questions_user: registration.questions.map(function (q) {
                            return {
                              QuestionId: q.QuestionId
                            };
                          })
                        }, registration.project_code, registration.id));

                      case 9:
                        participant = _context.sent;
                        userId = participant.id;
                        _context.next = 17;
                        break;

                      case 13:
                        _context.next = 15;
                        return regeneratorRuntime.awrap(_this.createUserWithProject({
                          language: registration.language,
                          postalcode: registration.postalcode,
                          email: registration.email,
                          gsm: registration.gsm,
                          firstname: registration.firstname,
                          lastname: registration.lastname,
                          sex: registration.sex,
                          birthmonth: registration.birthmonth,
                          sizeId: registration.sizeId,
                          via: registration.via,
                          medical: registration.medical,
                          gsm_guardian: registration.gsm_guardian,
                          email_guardian: registration.email_guardian,
                          general_questions: registration.general_questions,
                          eventId: registration.eventId,
                          municipality_name: registration.municipality_name,
                          street: registration.street,
                          house_number: registration.house_number,
                          box_number: registration.box_number,
                          questions_user: registration.questions.map(function (q) {
                            return {
                              QuestionId: q.QuestionId
                            };
                          }),
                          project: {
                            eventId: registration.eventId,
                            project_name: registration.project_name,
                            project_descr: registration.project_descr,
                            project_type: registration.project_type,
                            project_lang: registration.project_lang,
                            max_tokens: registration.max_tokens
                          }
                        }, registration.id));

                      case 15:
                        owner = _context.sent;
                        userId = owner.id;

                      case 17:
                        _context.next = 19;
                        return regeneratorRuntime.awrap(_this.getUser(userId));

                      case 19:
                        return _context.abrupt("return", _context.sent);

                      case 20:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
    /**
       * @param {string} password - unencrypted password
       * @returns {string}
       */

  }, {
    key: "createUserWithProject",

    /**
      * Create a new user with a project
      * @param {Object} userProject - UserProject object
      * @returns {Promise<models.User>}
      * @example     
          {
              postalcode: 1000,
              email: "test@test.be",
              gsm: "003237722452",
              firstname: 'John',
              lastname: 'Doe',
              sex: 'm',
              birthmonth: new Date(2003, 01, 01),
              mandatory_approvals: 'aa',
              t_size: 'female_large',
              project: {
                  project_name: 'test',
                  project_descr: 'aaa',
                  project_type: 'aa'
              }
          }
      */
    value: function createUserWithProject(userProject, registrationId) {
      var user;
      return regeneratorRuntime.async(function createUserWithProject$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(User.create(userProject, {
                include: ['project', {
                  model: QuestionUser,
                  as: 'questions_user'
                }]
              }));

            case 2:
              user = _context3.sent;
              _context3.next = 5;
              return regeneratorRuntime.awrap(Registration.destroy({
                where: {
                  id: registrationId
                }
              }));

            case 5:
              return _context3.abrupt("return", user);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
    /**
       * Create a new user with a token
       * @param {Object} user - User object 
       * @param {Number} voucherId - voucher id
       * @returns {Promise<models.User>}
       * @example
          {
              postalcode: 1000,
              email: "test@test.be",
              gsm: "003237722452",
              firstname: 'John',
              lastname: 'Doe',
              sex: 'm',                
              birthmonth: new Date(2003, 01, 01),
              mandatory_approvals: 'aa',
              t_size: 'female_large'
          }
       */

  }, {
    key: "createUserWithVoucher",
    value: function createUserWithVoucher(user_data, voucherId, registrationId) {
      var voucher, user;
      return regeneratorRuntime.async(function createUserWithVoucher$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(Voucher.findOne({
                where: {
                  id: voucherId,
                  participantId: null
                },
                lock: true
              }));

            case 2:
              voucher = _context4.sent;

              if (!(voucher === null)) {
                _context4.next = 5;
                break;
              }

              throw new Error("Token ".concat(voucherId, " not found"));

            case 5:
              _context4.next = 7;
              return regeneratorRuntime.awrap(User.create(user_data, {
                include: [{
                  model: QuestionUser,
                  as: 'questions_user'
                }]
              }));

            case 7:
              user = _context4.sent;
              _context4.next = 10;
              return regeneratorRuntime.awrap(voucher.setParticipant(user));

            case 10:
              _context4.next = 12;
              return regeneratorRuntime.awrap(Registration.destroy({
                where: {
                  id: registrationId
                }
              }));

            case 12:
              return _context4.abrupt("return", user);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
    /**
       * Update user information
       * @param {User} user
       * @param {Number} userId
       * @returns {Promise<Boolean>} updated successfully
       */

  }, {
    key: "updateUser",
    value: function updateUser(changedFields, userId) {
      return regeneratorRuntime.async(function updateUser$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee2() {
                var address, user, event, birthmonth, minGuardian;
                return regeneratorRuntime.async(function _callee2$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        // remove fields that are not allowed to change (be paranoid)
                        delete changedFields.email; //flatten address

                        address = changedFields.address;
                        changedFields.postalcode = address.postalcode;
                        changedFields.street = address.street;
                        changedFields.house_number = address.house_number;
                        changedFields.box_number = address.box_number;
                        changedFields.municipality_name = address.municipality_name;
                        delete changedFields.address; // cleanup guardian fields when not needed anymore

                        _context5.next = 10;
                        return regeneratorRuntime.awrap(User.findByPk(userId, {
                          include: [{
                            model: Question,
                            as: 'questions'
                          }]
                        }));

                      case 10:
                        user = _context5.sent;
                        _context5.next = 13;
                        return regeneratorRuntime.awrap(user.getEvent());

                      case 13:
                        event = _context5.sent;
                        _context5.next = 16;
                        return regeneratorRuntime.awrap(user.setQuestions(changedFields.mandatory_approvals.concat(changedFields.general_questions)));

                      case 16:
                        // map questions
                        delete changedFields.mandatory_approvals;
                        delete changedFields.general_questions; // create date

                        birthmonth = new Date(changedFields.year, changedFields.month, 1);
                        delete changedFields.year;
                        delete changedFields.month;
                        changedFields.birthmonth = birthmonth;
                        minGuardian = addYears(event.startDate, -1 * event.minGuardianAge);

                        if (minGuardian > birthmonth) {
                          changedFields.gsm_guardian = null;
                          changedFields.email_guardian = null;
                        }

                        changedFields.sizeId = changedFields.t_size;
                        _context5.next = 27;
                        return regeneratorRuntime.awrap(user.update(changedFields));

                      case 27:
                        return _context5.abrupt("return", _context5.sent);

                      case 28:
                      case "end":
                        return _context5.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context6.abrupt("return", _context6.sent);

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
    /**
       * Delete a user
       * @param {Number} userId
       * @returns {Promise<Boolean>} Delete ok ?
       */

  }, {
    key: "deleteUser",
    value: function deleteUser(userId) {
      var project, project_voucher, result;
      return regeneratorRuntime.async(function deleteUser$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(Project.findOne({
                where: {
                  ownerId: userId
                },
                attributes: ['id']
              }));

            case 2:
              project = _context7.sent;

              if (!project) {
                _context7.next = 5;
                break;
              }

              throw new Error('Project found');

            case 5:
              _context7.next = 7;
              return regeneratorRuntime.awrap(Voucher.findOne({
                where: {
                  participantId: userId
                },
                attributes: ['id']
              }));

            case 7:
              project_voucher = _context7.sent;

              if (!project_voucher) {
                _context7.next = 10;
                break;
              }

              throw new Error('Project participation found');

            case 10:
              _context7.next = 12;
              return regeneratorRuntime.awrap(User.destroy({
                where: {
                  id: userId
                }
              }));

            case 12:
              result = _context7.sent;
              return _context7.abrupt("return", result);

            case 14:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
    /**
       * create a project and assign to existing user
       * @param {Object} project
       * @returns {Promise<models.Project>} created account
       */

  }, {
    key: "createProject",
    value: function createProject(project, userId) {
      var user, event;
      return regeneratorRuntime.async(function createProject$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(User.findByPk(userId));

            case 2:
              user = _context8.sent;
              _context8.next = 5;
              return regeneratorRuntime.awrap(user.getEvent());

            case 5:
              event = _context8.sent;
              project.ownerId = userId;
              project.max_tokens = event.maxVoucher;
              _context8.next = 10;
              return regeneratorRuntime.awrap(Project.create(project));

            case 10:
              return _context8.abrupt("return", _context8.sent);

            case 11:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
    /**
       * Create a Account (user for admin panel & jury)
       * @param {Object} account
       * @returns {Promise<Account>} account
       */

  }, {
    key: "createAccount",
    value: function createAccount(account) {
      return regeneratorRuntime.async(function createAccount$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(Account.create(account));

            case 2:
              return _context9.abrupt("return", _context9.sent);

            case 3:
            case "end":
              return _context9.stop();
          }
        }
      });
    }
    /**
       * Update a project
       * @param {Project} project 
       * @param {Number} userId
       * @returns {Promise<Boolean>} Delete ok ?
       */

  }, {
    key: "updateProject",
    value: function updateProject(changedFields, userId) {
      var project;
      return regeneratorRuntime.async(function updateProject$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return regeneratorRuntime.awrap(Project.findOne({
                where: {
                  ownerId: userId
                }
              }));

            case 2:
              project = _context10.sent;
              return _context10.abrupt("return", project.update(changedFields));

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      });
    }
    /**
       * @param {Number} userId
       * @returns {Promise<Boolean>} Is user allowed to be deleted ?
       */

  }, {
    key: "isUserDeletable",
    value: function isUserDeletable(userId) {
      return regeneratorRuntime.async(function isUserDeletable$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee3() {
                var project;
                return regeneratorRuntime.async(function _callee3$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return regeneratorRuntime.awrap(Project.findOne({
                          where: {
                            ownerId: userId
                          },
                          attributes: ['id'],
                          lock: true
                        }));

                      case 2:
                        project = _context11.sent;

                        if (!(project !== null)) {
                          _context11.next = 5;
                          break;
                        }

                        return _context11.abrupt("return", false);

                      case 5:
                        return _context11.abrupt("return", true);

                      case 6:
                      case "end":
                        return _context11.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context12.abrupt("return", _context12.sent);

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      });
    }
    /**
       * Delete a project
       * @param {Number} userId 
       * @returns {Promise<Boolean>} delete ok 
       */

  }, {
    key: "deleteProject",
    value: function deleteProject(userId) {
      var _this2 = this;

      return regeneratorRuntime.async(function deleteProject$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee4() {
                var project, usedVoucher, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, a, blob;

                return regeneratorRuntime.async(function _callee4$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return regeneratorRuntime.awrap(Project.findOne({
                          where: {
                            ownerId: userId
                          },
                          attributes: ['id'],
                          lock: true
                        }));

                      case 2:
                        project = _context13.sent;

                        if (!(project !== null)) {
                          _context13.next = 46;
                          break;
                        }

                        _context13.next = 6;
                        return regeneratorRuntime.awrap(Voucher.count({
                          where: {
                            projectId: project.id,
                            participantId: _defineProperty({}, Op.ne, null)
                          },
                          lock: true
                        }));

                      case 6:
                        usedVoucher = _context13.sent;

                        if (!(usedVoucher > 0)) {
                          _context13.next = 9;
                          break;
                        }

                        throw new Error('Delete not possible tokens in use');

                      case 9:
                        // delete files on azure
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context13.prev = 12;
                        _context13.next = 15;
                        return regeneratorRuntime.awrap(project.getAttachments());

                      case 15:
                        _context13.t0 = Symbol.iterator;
                        _iterator = _context13.sent[_context13.t0]();

                      case 17:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context13.next = 27;
                          break;
                        }

                        a = _step.value;
                        _context13.next = 21;
                        return regeneratorRuntime.awrap(a.getAzureBlob());

                      case 21:
                        blob = _context13.sent;
                        _context13.next = 24;
                        return regeneratorRuntime.awrap(_this2.azure.deleteBlob(blob.blob_name));

                      case 24:
                        _iteratorNormalCompletion = true;
                        _context13.next = 17;
                        break;

                      case 27:
                        _context13.next = 33;
                        break;

                      case 29:
                        _context13.prev = 29;
                        _context13.t1 = _context13["catch"](12);
                        _didIteratorError = true;
                        _iteratorError = _context13.t1;

                      case 33:
                        _context13.prev = 33;
                        _context13.prev = 34;

                        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                          _iterator["return"]();
                        }

                      case 36:
                        _context13.prev = 36;

                        if (!_didIteratorError) {
                          _context13.next = 39;
                          break;
                        }

                        throw _iteratorError;

                      case 39:
                        return _context13.finish(36);

                      case 40:
                        return _context13.finish(33);

                      case 41:
                        _context13.next = 43;
                        return regeneratorRuntime.awrap(Project.destroy({
                          where: {
                            ownerId: userId
                          }
                        }));

                      case 43:
                        return _context13.abrupt("return", _context13.sent);

                      case 46:
                        _context13.next = 48;
                        return regeneratorRuntime.awrap(Voucher.destroy({
                          where: {
                            participantId: userId
                          }
                        }));

                      case 48:
                        return _context13.abrupt("return", _context13.sent);

                      case 49:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, null, null, [[12, 29, 33, 41], [34,, 36, 40]]);
              }));

            case 2:
              return _context14.abrupt("return", _context14.sent);

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      });
    }
    /**
       * Create a voucher for a project
       * @param {Number} projectId 
       * @returns {Promise<models.Voucher>} created voucher
       */

  }, {
    key: "createVoucher",
    value: function createVoucher(userId) {
      return regeneratorRuntime.async(function createVoucher$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee5() {
                var project, totalVouchers, token;
                return regeneratorRuntime.async(function _callee5$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        _context15.next = 2;
                        return regeneratorRuntime.awrap(Project.findOne({
                          where: {
                            ownerId: userId
                          },
                          attributes: ['id', 'eventId', 'max_tokens'],
                          lock: true
                        }));

                      case 2:
                        project = _context15.sent;

                        if (!(project === null)) {
                          _context15.next = 5;
                          break;
                        }

                        throw new Error('No project found');

                      case 5:
                        _context15.next = 7;
                        return regeneratorRuntime.awrap(Voucher.count({
                          where: {
                            projectId: project.id
                          },
                          lock: true
                        }));

                      case 7:
                        totalVouchers = _context15.sent;

                        if (!(totalVouchers >= project.max_tokens)) {
                          _context15.next = 10;
                          break;
                        }

                        throw new Error('Max token reached');

                      case 10:
                        _context15.next = 12;
                        return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
                          crypto.randomBytes(18, function (error, buffer) {
                            if (error) {
                              reject(error);
                            }

                            resolve(buffer.toString('hex'));
                          });
                        }));

                      case 12:
                        token = _context15.sent;
                        _context15.next = 15;
                        return regeneratorRuntime.awrap(Voucher.create({
                          projectId: project.id,
                          id: token,
                          eventId: project.eventId
                        }));

                      case 15:
                        return _context15.abrupt("return", _context15.sent);

                      case 16:
                      case "end":
                        return _context15.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context16.abrupt("return", _context16.sent);

            case 3:
            case "end":
              return _context16.stop();
          }
        }
      });
    }
    /**
       * Create a attachment for a project
       * @param {Number} userId 
       */

  }, {
    key: "getAttachmentSAS",
    value: function getAttachmentSAS(name, userId) {
      var project, azureInfo;
      return regeneratorRuntime.async(function getAttachmentSAS$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return regeneratorRuntime.awrap(Project.findOne({
                where: {
                  ownerId: userId
                },
                attributes: ['id']
              }));

            case 2:
              project = _context17.sent;

              if (!(project === null)) {
                _context17.next = 5;
                break;
              }

              throw new Error('No project found');

            case 5:
              _context17.next = 7;
              return regeneratorRuntime.awrap(AzureBlob.findOne({
                where: {
                  '$Attachment.ProjectId$': project.id,
                  blob_name: name
                },
                include: [{
                  model: Attachment
                }]
              }));

            case 7:
              azureInfo = _context17.sent;

              if (!(azureInfo === null)) {
                _context17.next = 10;
                break;
              }

              throw new Error('No attachment found');

            case 10:
              _context17.next = 12;
              return regeneratorRuntime.awrap(this.azure.generateSAS(name));

            case 12:
              return _context17.abrupt("return", _context17.sent);

            case 13:
            case "end":
              return _context17.stop();
          }
        }
      }, null, this);
    }
    /**
       * Create a attachment for a project
       * @param {Number} userId 
       */

  }, {
    key: "createAttachment",
    value: function createAttachment(attachment_fields, userId) {
      var _this3 = this;

      return regeneratorRuntime.async(function createAttachment$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee6() {
                var project, event, blobName, containerName, attachment, sas;
                return regeneratorRuntime.async(function _callee6$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        _context18.next = 2;
                        return regeneratorRuntime.awrap(Project.findOne({
                          where: {
                            ownerId: userId
                          },
                          attributes: ['id']
                        }));

                      case 2:
                        project = _context18.sent;

                        if (!(project === null)) {
                          _context18.next = 5;
                          break;
                        }

                        throw new Error('No project found');

                      case 5:
                        // do some simple "validations"
                        // this just checks if the provided files size is bigger than the allowed one 
                        // this is user input, you need to validate this later on (TODO look into azure blob hooks)
                        event = project.getEvent();

                        if (!(attachment_fields.size > event.maxFileSize)) {
                          _context18.next = 8;
                          break;
                        }

                        throw new Error('File validation failed');

                      case 8:
                        blobName = uuidv4();
                        containerName = process.env.AZURE_STORAGE_CONTAINER; // create AzureBlob & create Attachment

                        _context18.next = 12;
                        return regeneratorRuntime.awrap(AzureBlob.create({
                          container_name: containerName,
                          blob_name: blobName,
                          size: attachment_fields.size,
                          Attachment: {
                            name: attachment_fields.name,
                            filename: attachment_fields.filename,
                            ProjectId: project.id,
                            confirmed: false,
                            internal: false
                          }
                        }, {
                          include: [{
                            association: 'Attachment'
                          }]
                        }));

                      case 12:
                        attachment = _context18.sent;

                        if (!(attachment === null)) {
                          _context18.next = 15;
                          break;
                        }

                        throw new Error('Attachment failed');

                      case 15:
                        _context18.next = 17;
                        return regeneratorRuntime.awrap(_this3.azure.generateSAS(blobName));

                      case 17:
                        sas = _context18.sent;
                        return _context18.abrupt("return", sas);

                      case 19:
                      case "end":
                        return _context18.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context19.abrupt("return", _context19.sent);

            case 3:
            case "end":
              return _context19.stop();
          }
        }
      });
    }
    /**
       * Create a attachment for a project
       * @param {Number} attachmentId 
       */

  }, {
    key: "deleteAttachment",
    value: function deleteAttachment(userId, name) {
      var _this4 = this;

      return regeneratorRuntime.async(function deleteAttachment$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee7() {
                var project, azureInfo;
                return regeneratorRuntime.async(function _callee7$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        _context20.next = 2;
                        return regeneratorRuntime.awrap(Project.findOne({
                          where: {
                            ownerId: userId
                          },
                          attributes: ['id']
                        }));

                      case 2:
                        project = _context20.sent;

                        if (!(project === null)) {
                          _context20.next = 5;
                          break;
                        }

                        throw new Error('No project found');

                      case 5:
                        _context20.next = 7;
                        return regeneratorRuntime.awrap(AzureBlob.findOne({
                          where: {
                            '$Attachment.ProjectId$': project.id,
                            '$Attachment.confirmed$': false,
                            '$Attachment.internal$': false,
                            blob_name: name
                          },
                          include: [{
                            model: Attachment
                          }]
                        }));

                      case 7:
                        azureInfo = _context20.sent;

                        if (!(azureInfo === null)) {
                          _context20.next = 10;
                          break;
                        }

                        throw new Error('No attachment found');

                      case 10:
                        _context20.next = 12;
                        return regeneratorRuntime.awrap(Attachment.destroy({
                          where: {
                            id: azureInfo.Attachment.id
                          }
                        }));

                      case 12:
                        _context20.next = 14;
                        return regeneratorRuntime.awrap(_this4.azure.deleteBlob(name));

                      case 14:
                        return _context20.abrupt("return", null);

                      case 15:
                      case "end":
                        return _context20.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context21.abrupt("return", _context21.sent);

            case 3:
            case "end":
              return _context21.stop();
          }
        }
      });
    }
    /**
       * Delete a participant from a project
       * @param {Number} projectId 
       * @param {Number} participantId
       * @returns {Promise<Boolean>} delete successfully
       */

  }, {
    key: "deleteParticipantProject",
    value: function deleteParticipantProject(projectId, participantId) {
      return regeneratorRuntime.async(function deleteParticipantProject$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              _context22.next = 2;
              return regeneratorRuntime.awrap(Voucher.destroy({
                where: {
                  projectId: projectId,
                  participantId: participantId
                }
              }));

            case 2:
              return _context22.abrupt("return", _context22.sent);

            case 3:
            case "end":
              return _context22.stop();
          }
        }
      });
    }
    /**
       * Add participant to a project
       * @param {Number} userId 
       * @param {Number} voucherId 
       * @returns {Promise<models.User>} created participant
       */

  }, {
    key: "addParticipantProject",
    value: function addParticipantProject(userId, voucherId) {
      var voucher;
      return regeneratorRuntime.async(function addParticipantProject$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              _context23.next = 2;
              return regeneratorRuntime.awrap(Voucher.findOne({
                where: {
                  id: voucherId,
                  participantId: null
                },
                lock: true
              }));

            case 2:
              voucher = _context23.sent;

              if (!(voucher === null)) {
                _context23.next = 5;
                break;
              }

              throw new Error('Voucher not found');

            case 5:
              _context23.next = 7;
              return regeneratorRuntime.awrap(voucher.setParticipant(userId));

            case 7:
              _context23.next = 9;
              return regeneratorRuntime.awrap(voucher.getParticipant());

            case 9:
              return _context23.abrupt("return", _context23.sent);

            case 10:
            case "end":
              return _context23.stop();
          }
        }
      });
    }
    /** 
     * Validate & remove fields that are not needed
     * @param {Object} dbValues
     * @param {models.Event} event
    */

  }, {
    key: "validateRegistration",
    value: function validateRegistration(dbValues, event) {
      var possibleQuestions, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _loop, _iterator2, _step2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _loop2, _iterator3, _step3, minAgeDate, maxAgeDate, minGuardian;

      return regeneratorRuntime.async(function validateRegistration$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              _context24.next = 2;
              return regeneratorRuntime.awrap(event.getQuestions());

            case 2:
              possibleQuestions = _context24.sent;
              // 1a) are all questions mapped to this event
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context24.prev = 6;

              _loop = function _loop() {
                var q = _step2.value;

                if (!possibleQuestions.some(function (value) {
                  return value.id === q.QuestionId;
                })) {
                  throw new Error('questions are not from the correct event');
                }
              };

              for (_iterator2 = dbValues.questions[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                _loop();
              } // 1b) are the mandatory approvals filled in


              _context24.next = 15;
              break;

            case 11:
              _context24.prev = 11;
              _context24.t0 = _context24["catch"](6);
              _didIteratorError2 = true;
              _iteratorError2 = _context24.t0;

            case 15:
              _context24.prev = 15;
              _context24.prev = 16;

              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }

            case 18:
              _context24.prev = 18;

              if (!_didIteratorError2) {
                _context24.next = 21;
                break;
              }

              throw _iteratorError2;

            case 21:
              return _context24.finish(18);

            case 22:
              return _context24.finish(15);

            case 23:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context24.prev = 26;

              _loop2 = function _loop2() {
                var q = _step3.value;

                if (!dbValues.questions.some(function (value) {
                  return value.QuestionId === q.id;
                })) {
                  throw new Error('mandatory questions not filled in');
                }
              };

              for (_iterator3 = possibleQuestions.filter(function (value) {
                return value.mandatory === true;
              })[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                _loop2();
              } // validate data based on event settings


              _context24.next = 35;
              break;

            case 31:
              _context24.prev = 31;
              _context24.t1 = _context24["catch"](26);
              _didIteratorError3 = true;
              _iteratorError3 = _context24.t1;

            case 35:
              _context24.prev = 35;
              _context24.prev = 36;

              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }

            case 38:
              _context24.prev = 38;

              if (!_didIteratorError3) {
                _context24.next = 41;
                break;
              }

              throw _iteratorError3;

            case 41:
              return _context24.finish(38);

            case 42:
              return _context24.finish(35);

            case 43:
              minAgeDate = addYears(event.eventBeginDate, -1 * event.minAge);
              maxAgeDate = addYears(event.eventBeginDate, -1 * event.maxAge);
              console.log('ages:');
              console.log(minAgeDate);
              console.log(maxAgeDate); // 2) check if birthdate is valid

              if (dbValues.birthmonth < minAgeDate && dbValues.birthmonth > maxAgeDate) {
                _context24.next = 50;
                break;
              }

              throw new Error('incorrect age');

            case 50:
              // 3) check if guardian is required
              minGuardian = addYears(event.eventBeginDate, -1 * event.minGuardianAge);
              console.log(minGuardian);

              if (!(minGuardian < dbValues.birthmonth)) {
                _context24.next = 57;
                break;
              }

              if (!(typeof dbValues.gsm_guardian === 'undefined' || typeof dbValues.email_guardian === 'undefined')) {
                _context24.next = 55;
                break;
              }

              throw new Error('Guardian is required');

            case 55:
              _context24.next = 59;
              break;

            case 57:
              if (!(typeof dbValues.gsm_guardian !== 'undefined' || typeof dbValues.email_guardian !== 'undefined')) {
                _context24.next = 59;
                break;
              }

              throw new Error('Guardian is filled in');

            case 59:
              if (!(dbValues.project_code == null)) {
                _context24.next = 64;
                break;
              }

              if (!(dbValues.project_name == null || dbValues.project_descr == null || dbValues.project_type == null || dbValues.project_lang == null)) {
                _context24.next = 62;
                break;
              }

              throw new Error('Project not filled in');

            case 62:
              _context24.next = 66;
              break;

            case 64:
              if (!(dbValues.project_name != null && dbValues.project_descr != null && dbValues.project_type != null && dbValues.project_lang != null)) {
                _context24.next = 66;
                break;
              }

              throw new Error('Project filled in');

            case 66:
              return _context24.abrupt("return", dbValues);

            case 67:
            case "end":
              return _context24.stop();
          }
        }
      }, null, null, [[6, 11, 15, 23], [16,, 18, 22], [26, 31, 35, 43], [36,, 38, 42]]);
    }
    /**
       * Add registration
       * @param {Object} registrationValues
       * @returns {Promise<models.Registration>} created registration
       */

  }, {
    key: "createRegistration",
    value: function createRegistration(registrationValues) {
      var _this5 = this;

      return regeneratorRuntime.async(function createRegistration$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              _context26.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee8() {
                var event, dbValues, user, answers, address, ownProject, otherProject, registration_count;
                return regeneratorRuntime.async(function _callee8$(_context25) {
                  while (1) {
                    switch (_context25.prev = _context25.next) {
                      case 0:
                        _context25.next = 2;
                        return regeneratorRuntime.awrap(_this5.getEventActive());

                      case 2:
                        event = _context25.sent;

                        if (!(event === null)) {
                          _context25.next = 5;
                          break;
                        }

                        throw new Error('No Active event found');

                      case 5:
                        dbValues = {};
                        dbValues.eventId = event.id;
                        dbValues.max_tokens = event.maxVoucher; //flatten user + guardian

                        user = registrationValues.user;
                        dbValues.language = user.language;
                        dbValues.email = user.email;
                        dbValues.firstname = user.firstname;
                        dbValues.lastname = user.lastname;
                        dbValues.sex = user.sex; //dbValues.birthmonth = user.birthmonth;

                        dbValues.via = user.via;
                        dbValues.medical = user.medical;
                        dbValues.gsm = user.gsm;
                        dbValues.gsm_guardian = user.gsm_guardian;
                        dbValues.email_guardian = user.email_guardian;
                        dbValues.sizeId = user.t_size; // to month (set hour to 12)

                        dbValues.birthmonth = new Date(user.year, user.month, 12); // map the questions to the correct table

                        answers = [];

                        if (user.general_questions) {
                          answers.push.apply(answers, _toConsumableArray(user.general_questions.map(function (QuestionId) {
                            return {
                              QuestionId: QuestionId
                            };
                          })));
                        }

                        if (user.mandatory_approvals) {
                          answers.push.apply(answers, _toConsumableArray(user.mandatory_approvals.map(function (QuestionId) {
                            return {
                              QuestionId: QuestionId
                            };
                          })));
                        }

                        dbValues.questions = answers; //flatten address

                        address = user.address;
                        dbValues.postalcode = address.postalcode;
                        dbValues.street = address.street;
                        dbValues.house_number = address.house_number;
                        dbValues.box_number = address.box_number;
                        dbValues.municipality_name = address.municipality_name; //flatten own project

                        ownProject = registrationValues.project.own_project;

                        if (ownProject) {
                          dbValues.project_name = ownProject.project_name;
                          dbValues.project_descr = ownProject.project_descr;
                          dbValues.project_type = ownProject.project_type;
                          dbValues.project_lang = ownProject.project_lang;
                        } //flatten other project


                        otherProject = registrationValues.project.other_project;

                        if (otherProject) {
                          dbValues.project_code = otherProject.project_code;
                        }

                        _context25.next = 37;
                        return regeneratorRuntime.awrap(_this5.validateRegistration(dbValues, event));

                      case 37:
                        _context25.next = 39;
                        return regeneratorRuntime.awrap(User.count({
                          where: {
                            eventId: event.id
                          },
                          lock: true
                        }));

                      case 39:
                        _context25.t0 = _context25.sent;
                        _context25.next = 42;
                        return regeneratorRuntime.awrap(Registration.count({
                          where: {
                            eventId: event.id
                          },
                          lock: true
                        }));

                      case 42:
                        _context25.t1 = _context25.sent;
                        registration_count = _context25.t0 + _context25.t1;

                        if (registration_count >= event.maxRegistration) {
                          dbValues.waiting_list = true;
                        }

                        _context25.next = 47;
                        return regeneratorRuntime.awrap(Registration.create(dbValues, {
                          include: [{
                            model: QuestionRegistration,
                            as: 'questions'
                          }]
                        }));

                      case 47:
                        return _context25.abrupt("return", _context25.sent);

                      case 48:
                      case "end":
                        return _context25.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context26.abrupt("return", _context26.sent);

            case 3:
            case "end":
              return _context26.stop();
          }
        }
      });
    }
    /**
       * Get registration
       * @param {Registration} registration
       * @returns {Promise<models.egistration>}
       */

  }, {
    key: "getRegistration",
    value: function getRegistration(registrationId) {
      return regeneratorRuntime.async(function getRegistration$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              _context27.next = 2;
              return regeneratorRuntime.awrap(Registration.findByPk(registrationId, {
                lock: true,
                include: [{
                  model: QuestionRegistration,
                  as: 'questions'
                }, {
                  model: Event,
                  as: 'event'
                }]
              }));

            case 2:
              return _context27.abrupt("return", _context27.sent);

            case 3:
            case "end":
              return _context27.stop();
          }
        }
      });
    }
    /**
       * Add registration
       * @param {Registration} registration
       * @returns {Promise<models.Registration>}
       */

  }, {
    key: "getUser",
    value: function getUser(userId) {
      return regeneratorRuntime.async(function getUser$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              return _context28.abrupt("return", User.findByPk(userId));

            case 1:
            case "end":
              return _context28.stop();
          }
        }
      });
    }
    /**
       * Add registration
       * @param {Registration} registration
       * @returns {Promise<models.Voucher>} list of vouchers for project
       */

  }, {
    key: "getVouchers",
    value: function getVouchers(userId) {
      var project, vouchers;
      return regeneratorRuntime.async(function getVouchers$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return regeneratorRuntime.awrap(Project.findOne({
                where: {
                  ownerId: userId
                },
                attributes: ['id']
              }));

            case 2:
              project = _context29.sent;
              vouchers = [];

              if (!(project !== null)) {
                _context29.next = 8;
                break;
              }

              _context29.next = 7;
              return regeneratorRuntime.awrap(Voucher.findAll({
                where: {
                  projectId: project.id
                },
                attributes: ['id'],
                include: [{
                  model: User,
                  as: 'participant',
                  attributes: ['firstname', 'lastname']
                }]
              }));

            case 7:
              vouchers = _context29.sent;

            case 8:
              return _context29.abrupt("return", vouchers);

            case 9:
            case "end":
              return _context29.stop();
          }
        }
      });
    }
    /**
       * get Project
       * @param {Registration} registration
       * @returns {Promise<models.Registration>} project information
       */

  }, {
    key: "getProject",
    value: function getProject(userId) {
      var project, voucher;
      return regeneratorRuntime.async(function getProject$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              _context30.next = 2;
              return regeneratorRuntime.awrap(Project.findOne({
                where: {
                  ownerId: userId
                },
                include: [{
                  model: Voucher,
                  include: [{
                    model: User,
                    as: 'participant',
                    attributes: ['firstname', 'lastname', 'id']
                  }]
                }, {
                  model: User,
                  as: 'owner',
                  attributes: ['firstname', 'lastname']
                }]
              }));

            case 2:
              project = _context30.sent;

              if (!(project === null)) {
                _context30.next = 12;
                break;
              }

              _context30.next = 6;
              return regeneratorRuntime.awrap(Voucher.findOne({
                where: {
                  participantId: userId
                },
                attributes: ['projectId']
              }));

            case 6:
              voucher = _context30.sent;

              if (!(voucher === null)) {
                _context30.next = 9;
                break;
              }

              return _context30.abrupt("return");

            case 9:
              _context30.next = 11;
              return regeneratorRuntime.awrap(Project.findByPk(voucher.projectId, {
                include: [{
                  model: Voucher,
                  include: [{
                    model: User,
                    as: 'participant',
                    attributes: ['firstname', 'lastname', 'id']
                  }]
                }, {
                  model: User,
                  as: 'owner',
                  attributes: ['firstname', 'lastname']
                }]
              }));

            case 11:
              project = _context30.sent;

            case 12:
              return _context30.abrupt("return", project);

            case 13:
            case "end":
              return _context30.stop();
          }
        }
      });
    }
    /**
       * Check if email address exists in User records table
       * @param {String} emailAddress
       * @param {models.Event} event
       * @returns {Promise<Boolean>} 
       */

  }, {
    key: "doesEmailExists",
    value: function doesEmailExists(emailAddress, event) {
      var count;
      return regeneratorRuntime.async(function doesEmailExists$(_context31) {
        while (1) {
          switch (_context31.prev = _context31.next) {
            case 0:
              _context31.next = 2;
              return regeneratorRuntime.awrap(User.count({
                where: {
                  email: emailAddress,
                  eventId: event.id
                }
              }));

            case 2:
              count = _context31.sent;
              return _context31.abrupt("return", count !== 0);

            case 4:
            case "end":
              return _context31.stop();
          }
        }
      });
    }
    /**
       * Get user via email
       * @param {String} email
       * @returns {Promise<models.User>}
       */

  }, {
    key: "getUsersViaMail",
    value: function getUsersViaMail(email) {
      return regeneratorRuntime.async(function getUsersViaMail$(_context32) {
        while (1) {
          switch (_context32.prev = _context32.next) {
            case 0:
              _context32.next = 2;
              return regeneratorRuntime.awrap(User.findAll({
                where: _defineProperty({}, Op.or, [{
                  email: email
                }, {
                  email_guardian: email
                }])
              }));

            case 2:
              return _context32.abrupt("return", _context32.sent);

            case 3:
            case "end":
              return _context32.stop();
          }
        }
      });
    }
    /**
       * Get only user via email
       * @param {String} email
       * @returns {Promise<models.User>}
       */

  }, {
    key: "getOnlyUsersViaMail",
    value: function getOnlyUsersViaMail(email, event) {
      return regeneratorRuntime.async(function getOnlyUsersViaMail$(_context33) {
        while (1) {
          switch (_context33.prev = _context33.next) {
            case 0:
              _context33.next = 2;
              return regeneratorRuntime.awrap(User.findAll({
                where: {
                  email: email,
                  eventId: event.id
                }
              }));

            case 2:
              return _context33.abrupt("return", _context33.sent);

            case 3:
            case "end":
              return _context33.stop();
          }
        }
      });
    }
    /**
       * Update token
       * @param {Number} userId
       * @returns {Promise<models.User>}
       */

  }, {
    key: "updateLastToken",
    value: function updateLastToken(userId) {
      var user;
      return regeneratorRuntime.async(function updateLastToken$(_context34) {
        while (1) {
          switch (_context34.prev = _context34.next) {
            case 0:
              _context34.next = 2;
              return regeneratorRuntime.awrap(User.findByPk(userId));

            case 2:
              user = _context34.sent;
              user.last_token = new Date();
              _context34.next = 6;
              return regeneratorRuntime.awrap(user.save());

            case 6:
            case "end":
              return _context34.stop();
          }
        }
      });
    }
    /**
       * Set the event active
       * @param {Number} eventId
       * @returns {Promise<models.Event>}
       */

  }, {
    key: "setEventActive",
    value: function setEventActive(eventId) {
      return regeneratorRuntime.async(function setEventActive$(_context36) {
        while (1) {
          switch (_context36.prev = _context36.next) {
            case 0:
              _context36.next = 2;
              return regeneratorRuntime.awrap(sequelize.transaction(function _callee9() {
                var event;
                return regeneratorRuntime.async(function _callee9$(_context35) {
                  while (1) {
                    switch (_context35.prev = _context35.next) {
                      case 0:
                        _context35.next = 2;
                        return regeneratorRuntime.awrap(Event.update({
                          current: false
                        }, {
                          where: {}
                        }));

                      case 2:
                        _context35.next = 4;
                        return regeneratorRuntime.awrap(Event.findByPk(eventId));

                      case 4:
                        event = _context35.sent;

                        if (!(event === null)) {
                          _context35.next = 7;
                          break;
                        }

                        throw new Error('No event found');

                      case 7:
                        event.current = true;
                        _context35.next = 10;
                        return regeneratorRuntime.awrap(event.save());

                      case 10:
                        return _context35.abrupt("return", _context35.sent);

                      case 11:
                      case "end":
                        return _context35.stop();
                    }
                  }
                });
              }));

            case 2:
              return _context36.abrupt("return", _context36.sent);

            case 3:
            case "end":
              return _context36.stop();
          }
        }
      });
    }
    /**
       * get event by id
       * @param {Number} eventId
       * @returns {Promise<models.Event>}
       */

  }, {
    key: "getEvent",
    value: function getEvent(eventId) {
      return regeneratorRuntime.async(function getEvent$(_context37) {
        while (1) {
          switch (_context37.prev = _context37.next) {
            case 0:
              _context37.next = 2;
              return regeneratorRuntime.awrap(Event.findByPk(eventId));

            case 2:
              return _context37.abrupt("return", _context37.sent);

            case 3:
            case "end":
              return _context37.stop();
          }
        }
      });
    }
    /**
       * get active event
       * @returns {Promise<models.Event>}
       */

  }, {
    key: "getEventActive",
    value: function getEventActive() {
      var activeEventId;
      return regeneratorRuntime.async(function getEventActive$(_context38) {
        while (1) {
          switch (_context38.prev = _context38.next) {
            case 0:
              _context38.next = 2;
              return regeneratorRuntime.awrap(Event.findOne({
                where: {
                  eventBeginDate: _defineProperty({}, Op.lt, Sequelize.literal('CURDATE()')),
                  eventEndDate: _defineProperty({}, Op.gt, Sequelize.literal('CURDATE()'))
                },
                attributes: ['id']
              }));

            case 2:
              activeEventId = _context38.sent;

              if (!(activeEventId === null)) {
                _context38.next = 5;
                break;
              }

              throw new Error('No Event Active');

            case 5:
              _context38.next = 7;
              return regeneratorRuntime.awrap(this.getEventDetail(activeEventId.id));

            case 7:
              return _context38.abrupt("return", _context38.sent);

            case 8:
            case "end":
              return _context38.stop();
          }
        }
      }, null, this);
    }
    /**
       * get active event
       * @returns {Promise<Event>}
       */

  }, {
    key: "getEventDetail",
    value: function getEventDetail(eventId) {
      var language,
          event,
          questions,
          tshirts,
          _args39 = arguments;
      return regeneratorRuntime.async(function getEventDetail$(_context39) {
        while (1) {
          switch (_context39.prev = _context39.next) {
            case 0:
              language = _args39.length > 1 && _args39[1] !== undefined ? _args39[1] : 'en';
              _context39.next = 3;
              return regeneratorRuntime.awrap(Event.findByPk(eventId, {
                attributes: {
                  include: [[sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = Event.id and Vouchers.participantId IS NULL)'), 'total_unusedVouchers'], [sequelize.literal('(SELECT count(*) from Vouchers where Vouchers.eventID = Event.id and Vouchers.participantId > 0)'), 'total_usedVouchers'], [sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = Event.id)'), 'pending_users'], [sequelize.literal('(SELECT count(*) from Registrations where Registrations.eventId = Event.id and waiting_list = 1)'), 'waiting_list'], [sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments)'), 'total_videos'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'m\')'), 'total_males'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'f\')'), 'total_females'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.sex = \'x\')'), 'total_X'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'nl\')'), 'tlang_nl'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'fr\')'), 'tlang_fr'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id and Users.language = \'en\')'), 'tlang_en'], [sequelize.literal('(SELECT count(*) from Users where Users.eventId = Event.id)'), 'total_users'], [sequelize.literal('(SELECT count(DISTINCT Attachments.ProjectId ) from Attachments INNER JOIN Projects ON Projects.id = Attachments.ProjectId WHERE Projects.eventId = Event.id )'), 'total_videos'], [sequelize.literal('DATEDIFF(eventBeginDate, CURDATE())'), 'days_remaining'], [sequelize.literal('(SELECT count(*) from Projects where Projects.eventId = Event.id)'), 'total_projects'], [sequelize.literal("(SELECT count(*) from Registrations where Registrations.eventId = Event.id and DATE_ADD(Registrations.createdAt, INTERVAL ".concat(process.env.TOKEN_VALID_TIME, " SECOND) < CURDATE() )")), 'overdue_registration']]
                }
              }));

            case 3:
              event = _context39.sent;
              // count the questions grouped by event & type
              event.questions = [];
              _context39.next = 7;
              return regeneratorRuntime.awrap(QuestionUser.findAll({
                raw: true,
                attributes: [[sequelize.fn('COUNT', sequelize.col('UserId')), 'total'], [sequelize.col('QuestionUser.QuestionId'), 'id'], [sequelize.col('Question.name'), 'short'], [sequelize.col('Question.QuestionTranslations.description'), 'description']],
                group: 'QuestionUser.QuestionId',
                include: [{
                  model: User,
                  attributes: [],
                  where: {
                    'EventId': eventId
                  },
                  required: true
                }, {
                  model: Question,
                  attributes: [],
                  required: true,
                  include: [{
                    model: QuestionTranslation,
                    attributes: [],
                    where: {
                      'language': language
                    }
                  }]
                }]
              }));

            case 7:
              questions = _context39.sent;

              if (questions !== null) {
                event.questions = questions;
              } // count the t-shirts grouped by event & type


              event.tshirts = [];
              _context39.next = 12;
              return regeneratorRuntime.awrap(User.findAll({
                raw: true,
                attributes: [[sequelize.fn('COUNT', sequelize.col('User.id')), 'total'], [sequelize.col('User.SizeId'), 'id'], [sequelize.col('size.name'), 'short'], [sequelize.col('size.TShirtTranslations.description'), 'description']],
                group: 'User.SizeId',
                where: {
                  'EventId': eventId
                },
                include: [{
                  model: TShirt,
                  attributes: [],
                  required: true,
                  as: 'size',
                  include: [{
                    model: TShirtTranslation,
                    required: false,
                    attributes: [],
                    where: {
                      'language': language
                    }
                  }]
                }]
              }));

            case 12:
              tshirts = _context39.sent;

              if (tshirts !== null) {
                event.tshirts = tshirts;
              }

              return _context39.abrupt("return", event);

            case 15:
            case "end":
              return _context39.stop();
          }
        }
      });
    }
  }, {
    key: "getTshirtsGroups",
    value: function getTshirtsGroups(language) {
      return regeneratorRuntime.async(function getTshirtsGroups$(_context40) {
        while (1) {
          switch (_context40.prev = _context40.next) {
            case 0:
              _context40.next = 2;
              return regeneratorRuntime.awrap(TShirtGroup.findAll({
                attributes: ['id', 'name'],
                include: [{
                  model: TShirtGroupTranslation,
                  where: _defineProperty({}, Op.or, [{
                    language: language
                  }, {
                    language: 'nl'
                  }]),
                  required: false,
                  attributes: ['language', 'description']
                }]
              }));

            case 2:
              return _context40.abrupt("return", _context40.sent);

            case 3:
            case "end":
              return _context40.stop();
          }
        }
      });
    }
    /**
       * get active event
       * @returns {Promise<TShirt>}
       */

  }, {
    key: "getTshirts",
    value: function getTshirts(language, event) {
      return regeneratorRuntime.async(function getTshirts$(_context41) {
        while (1) {
          switch (_context41.prev = _context41.next) {
            case 0:
              _context41.next = 2;
              return regeneratorRuntime.awrap(TShirt.findAll({
                attributes: ['id', 'name'],
                include: [{
                  model: TShirtGroup,
                  as: 'group',
                  attributes: ['id', 'name'],
                  required: false,
                  include: [{
                    model: TShirtGroupTranslation,
                    where: _defineProperty({}, Op.or, [{
                      language: language
                    }, {
                      language: 'nl'
                    }]),
                    required: false,
                    attributes: ['language', 'description']
                  }]
                }, {
                  model: TShirtTranslation,
                  where: _defineProperty({}, Op.or, [{
                    language: language
                  }, {
                    language: 'nl'
                  }]),
                  required: false,
                  attributes: ['language', 'description']
                }],
                where: {
                  eventId: event.id
                }
              }));

            case 2:
              return _context41.abrupt("return", _context41.sent);

            case 3:
            case "end":
              return _context41.stop();
          }
        }
      });
    }
    /**
       * get questions
       * @returns {Promise<object>}
       */

  }, {
    key: "getQuestions",
    value: function getQuestions(language, event) {
      var optionalQuestions;
      return regeneratorRuntime.async(function getQuestions$(_context42) {
        while (1) {
          switch (_context42.prev = _context42.next) {
            case 0:
              _context42.next = 2;
              return regeneratorRuntime.awrap(Question.findAll({
                attributes: ['id', 'name'],
                where: {
                  eventId: event.id,
                  mandatory: _defineProperty({}, Op.not, true)
                },
                include: [{
                  model: QuestionTranslation,
                  where: _defineProperty({}, Op.or, [{
                    language: language
                  }, {
                    language: process.env.LANG
                  }]),
                  required: false,
                  attributes: ['language', 'description', 'positive', 'negative']
                }]
              }));

            case 2:
              optionalQuestions = _context42.sent;
              return _context42.abrupt("return", optionalQuestions.map(function (q) {
                // default to nl when no translation was found
                var languageIndex = q.QuestionTranslations.findIndex(function (x) {
                  return x.language === language;
                });

                if (languageIndex == -1) {
                  languageIndex = q.QuestionTranslations.findIndex(function (x) {
                    return x.language === process.env.LANG;
                  });
                }

                return {
                  'id': q.id,
                  'name': q.name,
                  'description': q.QuestionTranslations[languageIndex] ? q.QuestionTranslations[languageIndex].description : q.name,
                  'positive': q.QuestionTranslations[languageIndex] ? q.QuestionTranslations[languageIndex].positive : "positive ".concat(q.name),
                  'negative': q.QuestionTranslations[languageIndex] ? q.QuestionTranslations[languageIndex].negative : "negative ".concat(q.name)
                };
              }));

            case 4:
            case "end":
              return _context42.stop();
          }
        }
      });
    }
    /**
       * get approvals
       * @returns {Promise<object>}
       */

  }, {
    key: "getApprovals",
    value: function getApprovals(language, event) {
      var mandatoryQuestions;
      return regeneratorRuntime.async(function getApprovals$(_context43) {
        while (1) {
          switch (_context43.prev = _context43.next) {
            case 0:
              _context43.next = 2;
              return regeneratorRuntime.awrap(Question.findAll({
                attributes: ['id', 'name'],
                where: {
                  eventId: event.id,
                  mandatory: true
                },
                include: [{
                  model: QuestionTranslation,
                  where: _defineProperty({}, Op.or, [{
                    language: language
                  }, {
                    language: 'nl'
                  }]),
                  required: false,
                  attributes: ['language', 'description']
                }]
              }));

            case 2:
              mandatoryQuestions = _context43.sent;
              return _context43.abrupt("return", mandatoryQuestions.map(function (q) {
                // default to nl when no translation was found
                var languageIndex = q.QuestionTranslations.findIndex(function (x) {
                  return x.language === language;
                });

                if (languageIndex == -1) {
                  languageIndex = q.QuestionTranslations.findIndex(function (x) {
                    return x.language === 'nl';
                  });
                }

                return {
                  'id': q.id,
                  'name': q.name,
                  'description': q.QuestionTranslations[languageIndex] ? q.QuestionTranslations[languageIndex].description : q.name
                };
              }));

            case 4:
            case "end":
              return _context43.stop();
          }
        }
      });
    }
  }], [{
    key: "generatePwd",
    value: function generatePwd(password) {
      var salt = bcrypt.genSaltSync();
      var hash = bcrypt.hashSync(password, salt);
      return hash;
    }
  }]);

  return DBA;
}();

module.exports = DBA;