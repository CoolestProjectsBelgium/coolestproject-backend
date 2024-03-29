'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'woman', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtGroupId: 1 },
      { description: 'child', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtGroupId: 2 },
      { description: 'men', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtGroupId: 3 }
    ], {});
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3/4', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 1 },
      { description: 'kid_5/6', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 2 },
      { description: 'kid_7/8', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 3 },
      { description: 'kid_9/11', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 4 },
      { description: 'kid_12/14', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 5 },
      { description: 'female_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 6 },
      { description: 'female_xs', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 7 },
      { description: 'female_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 8 },
      { description: 'female_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 9 },
      { description: 'female_2xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 10 },
      { description: 'female_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 11 },
      { description: 'male_xsmall', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 12 },
      { description: 'male_small', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 13 },
      { description: 'male_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 14 },
      { description: 'male_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 15 },
      { description: 'male_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 16 },
      { description: 'male_xxl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 17 },
      { description: 'male_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 18 },
      { description: 'male_4xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 19 },      
      { description: 'male_5xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'en', tShirtId: 20 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'dames', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtGroupId: 1 },
      { description: 'kind', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtGroupId: 2 },
      { description: 'mannen', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtGroupId: 3 }
    ], {});

    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'enfant_3/4', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 1 },
      { description: 'enfant_5/6', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 2 },
      { description: 'enfant_7/8', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 3 },
      { description: 'enfant_9/11', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 4 },
      { description: 'enfant_12/14', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 5 },
      { description: 'femmes_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 6 },
      { description: 'femmes_xs', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 7 },
      { description: 'femmes_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 8 },
      { description: 'femmes_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 9 },
      { description: 'femmes_2xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 10 },
      { description: 'femmes_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 11 },
      { description: 'hommes_xsmall', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 12 },
      { description: 'hommes_small', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 13 },
      { description: 'hommes_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 14 },
      { description: 'hommes_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 15 },
      { description: 'hommes_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 16 },
      { description: 'hommes_xxl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 17 },
      { description: 'hommes_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 18 },
      { description: 'hommes_4xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 19 },
      { description: 'hommes_5xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtId: 20 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'femmes', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtGroupId: 1 },
      { description: 'enfant', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtGroupId: 2 },
      { description: 'hommes', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'fr', tShirtGroupId: 3 }
    ], {});

    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kind_3/4', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 1 },
      { description: 'kind_5/6', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 2 },
      { description: 'kind_7/8', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 3 },
      { description: 'kind_9/11', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 4 },
      { description: 'kind_12/14', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 5 },
      { description: 'dames_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 6 },
      { description: 'dames_xs',  createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 7 },
      { description: 'dames_large',  createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 8 },
      { description: 'dames_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 9 },
      { description: 'dames_2xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 10 },
      { description: 'dames_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 11 },
      { description: 'mannen_xsmall', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 12 },
      { description: 'mannen_small', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 13 },
      { description: 'mannen_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 14 },
      { description: 'mannen_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 15 },
      { description: 'mannen_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 16 },
      { description: 'mannen_xxl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 17 },
      { description: 'mannen_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 18 },
      { description: 'mannen_4xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 19 },
      { description: 'mannen_5xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), language: 'nl', tShirtId: 20 }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TShirtTranslations', null, {});
    await queryInterface.bulkDelete('TShirtGroupTranslations', null, {});
  }
};
