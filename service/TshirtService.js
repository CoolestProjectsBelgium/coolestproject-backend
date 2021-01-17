'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode

/**
 * get list of tshirts
 *
 * returns TShirts
 **/
exports.tshirtGET = function (language) {
    return new Promise(async function (resolve, reject) {
        try {
            const tshirts = await DBA.getTshirts(language);
            const groups = await DBA.getTshirtsGroups(language);

            // loop over group
            const result = groups.map((group) => {
                const t = group.TShirtGroupTranslations;
                let languageIndex = t.findIndex((x) => x.language === language);
                if (languageIndex == -1) {
                    languageIndex = t.findIndex((x) => x.language === process.env.LANG);
                }
                const tshirt = tshirts.filter((tshirt) => tshirt.group.name === group.name)
                const key = ((t[languageIndex]) ? t[languageIndex].description : group.name);
                // transform tshirt
                const items = tshirt.map((tshirt) => {
                    const t = tshirt.TShirtTranslations;
                    let languageIndex = t.findIndex((x) => x.language === language);
                    if (languageIndex == -1) {
                        languageIndex = t.findIndex((x) => x.language === process.env.LANG);
                    }
                    return { id: tshirt.id, name: ((t[languageIndex]) ? t[languageIndex].description : tshirt.name) }
                })
                return { group: key, items: items }
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