'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.tshirtGET = function () {
    return new Promise(async function (resolve, reject) {
        try {
            const tshirts = await DBA.getTshirts();
            resolve(tshirts);
        } catch (error) {
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}