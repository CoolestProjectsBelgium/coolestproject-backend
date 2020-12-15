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
            const groups = [...new Set(tshirts.map(item => item.group.name))]
            const t = groups.map(group_name => {
                return {
                    group: group_name,
                    items: tshirts.filter(item => item.group = group_name).map(
                        item => { return { id: item.id, name: item.name } })
                }
            });
            resolve(t);
        } catch (error) {
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}