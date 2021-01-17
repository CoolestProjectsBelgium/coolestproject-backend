'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode
const parser = require('accept-language-parser');

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.questionGET = function (language) {
    return new Promise(async function (resolve, reject) {
        try {
            const questions = await DBA.getQuestions(language.substring(0, 2));
            resolve(questions);
        } catch (error) {
            console.log(error)
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}