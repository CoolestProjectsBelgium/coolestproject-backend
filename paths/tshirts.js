module.exports = function(database) {
  const operations = {
    GET
  };
  
  async function GET(req, res) {
    const user = req.user || null;
    const language = req.language || null;

    let event = null;
    if (user) {
      event = await user.getEvent();
    } else {
      event = await database.getEventActive();
    }
        
    if (event === null) {
      throw new Error('No event found');
    }
        
    const tshirts = await database.getTshirts(language, event);
    const groups = await database.getTshirtsGroups(language, event);
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
    res.status(200).json(result);
  }
  
  return operations;
};