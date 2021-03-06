'use strict';

const DBA = require('../dba');
const respondWithCode = require('../utils/writer').respondWithCode;

/**
 * get list of tshirts
 *
 * returns TShirts
 **/
exports.tshirtGET = async function (language, user) {
  try {
    let event = null;
    if (user) {
      event = await user.getEvent();
    } else {
      event = await DBA.getEventActive();
    }

    if (event === null) {
      throw new Error('No event found');
    }

    const tshirts = await DBA.getTshirts(language, event);
    const groups = await DBA.getTshirtsGroups(language);
    if (tshirts === null || groups === null) {
      throw new Error('No Tshirts found');
    }

    // loop over group
    const result = groups.map((group) => {
      const t = group.TShirtGroupTranslations;
      let languageIndex = t.findIndex((x) => x.language === language);
      if (languageIndex == -1) {
        languageIndex = t.findIndex((x) => x.language === process.env.LANG);
      }
      const tshirt = tshirts.filter((tshirt) => tshirt.group.name === group.name);
      const key = ((t[languageIndex]) ? t[languageIndex].description : group.name);
      // transform tshirt
      const items = tshirt.map((tshirt) => {
        const t = tshirt.TShirtTranslations;
        let languageIndex = t.findIndex((x) => x.language === language);
        if (languageIndex == -1) {
          languageIndex = t.findIndex((x) => x.language === process.env.LANG);
        }
        return { id: tshirt.id, name: ((t[languageIndex]) ? t[languageIndex].description : tshirt.name) };
      });
      return { group: key, items: items };
    });
    return result;

  } catch (error) {
    console.log(error);
    throw new respondWithCode(500, {
      code: 0,
      message: 'Backend error'
    });
  }
};