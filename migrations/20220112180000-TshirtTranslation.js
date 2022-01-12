'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'woman', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 4 },
      { description: 'child', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 5 },
      { description: 'men', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 6 }
    ], {});
    
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 21 },
      { description: 'kid_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 22 },
      { description: 'kid_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 23 },
      { description: 'kid_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 24 },
      { description: 'kid_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 25 },
      { description: 'female_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 26 },
      { description: 'female_xs', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 27 },
      { description: 'female_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 28 },
      { description: 'female_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 29 },
      { description: 'female_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 30 },
      { description: 'female_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 31 },
      { description: 'male_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 32 },
      { description: 'male_small', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 33 },
      { description: 'male_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 34 },
      { description: 'male_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 35 },
      { description: 'male_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 36 },
      { description: 'male_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 37 },
      { description: 'male_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 38 },
      { description: 'male_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 39 },
      { description: 'male_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 40 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'dames', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtGroupId: 4 },
      { description: 'kind', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtGroupId: 5 },
      { description: 'mannen', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtGroupId: 6 }
    ], {});

    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'enfant_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 21 },
      { description: 'enfant_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 22 },
      { description: 'enfant_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 23 },
      { description: 'enfant_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 24 },
      { description: 'enfant_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 25 },
      { description: 'femmes_medium', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 26 },
      { description: 'femmes_xs', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 27 },
      { description: 'femmes_large', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 28 },
      { description: 'femmes_xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 29 },
      { description: 'femmes_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 30 },
      { description: 'femmes_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 31 },
      { description: 'hommes_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 32 },
      { description: 'hommes_small', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 33 },
      { description: 'hommes_medium', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 34 },
      { description: 'hommes_large', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 35 },
      { description: 'hommes_xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 36 },
      { description: 'hommes_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 37 },
      { description: 'hommes_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 38 },
      { description: 'hommes_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 39 },
      { description: 'hommes_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 40 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'femmes', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtGroupId: 4 },
      { description: 'enfant', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtGroupId: 5 },
      { description: 'hommes', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtGroupId: 6 }
    ], {});

    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kind_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 21 },
      { description: 'kind_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 22 },
      { description: 'kind_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 23 },
      { description: 'kind_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 24 },
      { description: 'kind_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 25 },
      { description: 'dames_medium', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 26 },
      { description: 'dames_xs',  createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 27 },
      { description: 'dames_large',  createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 28 },
      { description: 'dames_xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 29 },
      { description: 'dames_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 30 },
      { description: 'dames_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 31 },
      { description: 'mannen_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 32 },
      { description: 'mannen_small', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 33 },
      { description: 'mannen_medium', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 34 },
      { description: 'mannen_large', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 35 },
      { description: 'mannen_xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 36 },
      { description: 'mannen_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 37 },
      { description: 'mannen_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 38 },
      { description: 'mannen_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 39 },
      { description: 'mannen_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 40 }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('TShirtTranslations', null, {});
    // await queryInterface.bulkDelete('TShirtGroupTranslations', null, {});
  }
};
