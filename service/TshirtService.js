'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode

/**
 * get settings for frontend
 *
 * returns Settings
 **/
exports.tshirtGET = function (language) {
    return new Promise(async function (resolve, reject) {
        try {
            const tshirts = await DBA.getTshirts(language);
            const groups = await DBA.getTshirtsGroups(language);
            const result = {};

            // loop over group
            groups.forEach((group, index) => {
                const t = group.TShirtGroupTranslations;
                let languageIndex = t.findIndex((x) => x.language === language);
                if (languageIndex == -1) {
                    languageIndex = t.findIndex((x) => x.language === 'nl');
                }
                const tshirt = tshirts.filter((tshirt) => tshirt.group.name === group.name)
                const key = ((t[languageIndex]) ? t[languageIndex].description : group.name);
                // transform tshirt
                result[key] = tshirt.map((tshirt) => {
                    const t = tshirt.TShirtTranslations;
                    let languageIndex = t.findIndex((x) => x.language === language);
                    if (languageIndex == -1) {
                        languageIndex = t.findIndex((x) => x.language === 'nl');
                    }
                    return { id: tshirt.id, name: ((t[languageIndex]) ? t[languageIndex].description : tshirt.name) }
                })
            });
            resolve(result);
        } catch (error) {
            console.log(error)
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}