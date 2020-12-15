'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.questionGET = function () {
    return new Promise(async function (resolve, reject) {
        try {
            const questions = await DBA.getQuestions();
            resolve(questions);
        } catch (error) {
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}