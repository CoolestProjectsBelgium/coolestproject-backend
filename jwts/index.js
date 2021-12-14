'use strict';

var jwt = require('jsonwebtoken');

class Tokens {
  /**
     * generate a registration token
     * @param {Number} registrationId
     * @returns {Promise<String>}
     */
  static async generateRegistrationToken(registrationId) {
    return new Promise(function (resolve, reject) {
      try {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + Number.parseInt(process.env.TOKEN_VALID_TIME),
          registrationId: registrationId
        }, process.env.SECRET_KEY);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
     * generate login token
     * @param {Number} userId
     * @returns {Promise<String>}
     */
  static async generateLoginToken(userId) {
    return new Promise(function (resolve, reject) {
      try {
        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + Number.parseInt(process.env.TOKEN_VALID_TIME),
          iat: Math.floor(Date.now() / 1000) - 300, // backdate 300 seconds
          id: userId
        }, process.env.SECRET_KEY);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
     * validate token
     * @param {String} token
     * @returns {Promise<String>}
     */
  static async validateToken(token) {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (err) {
          reject({ auth: false, message: 'Failed to authenticate token' });
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = Tokens;