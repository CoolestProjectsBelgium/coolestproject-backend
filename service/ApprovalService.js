'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.approvalGET = function (l) {
    return new Promise(async function (resolve, reject) {
        try {
            const approval = await DBA.getApprovals(l);
            resolve(approval);
        } catch (error) {
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }
    })
}