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
            const groups = [...new Set(tshirts.map((item) => {
                const t = item.group.TShirtGroupTranslations;
                let languageIndex = t.findIndex((x) => x.language === language);
                if (languageIndex == -1) {
                    languageIndex = t.findIndex((x) => x.language === 'nl');
                }
                return ((t[languageIndex]) ? t[languageIndex].description : item.group.name) //item.group.name
            }))]
            const t = groups.map(group_name => {
                return {
                    group: group_name,
                    items: tshirts.filter(item => item.group = group_name).map(
                        sub => {
                            let languageIndex = sub.TShirtTranslations.findIndex((x) => x.language === language);
                            if (languageIndex == -1) {
                                languageIndex = sub.TShirtTranslations.findIndex((x) => x.language === 'nl');
                            }
                            const t = sub.TShirtTranslations;
                            return { id: sub.id, name: ((t[languageIndex]) ? t[languageIndex].description : sub.name) } //sub.name
                        })
                }
            });
            resolve(t);
        } catch (error) {
            console.log(error)
            reject(new respondWithCode(500, {
                code: 0,
                message: 'Backend error'
            }));
        }

    })
}