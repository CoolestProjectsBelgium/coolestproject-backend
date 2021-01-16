'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'woman', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 1 },
      { description: 'child', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 2 },
      { description: 'men', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 3 }
    ], {});
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 1 },
      { description: 'kid_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 2 },
      { description: 'kid_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 3 },
      { description: 'kid_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 4 },
      { description: 'kid_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 5 },
      { description: 'female_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 6 },
      { description: 'female_xs', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 7 },
      { description: 'female_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 8 },
      { description: 'female_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 9 },
      { description: 'female_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 10 },
      { description: 'female_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 11 },
      { description: 'male_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 12 },
      { description: 'male_small', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 13 },
      { description: 'male_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 14 },
      { description: 'male_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 15 },
      { description: 'male_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 16 },
      { description: 'male_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 17 },
      { description: 'male_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 18 },
      { description: 'male_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 19 },
      { description: 'male_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 20 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'woman', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 1 },
      { description: 'child', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 2 },
      { description: 'men', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 3 }
    ], {});
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 1 },
      { description: 'kid_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 2 },
      { description: 'kid_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 3 },
      { description: 'kid_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 4 },
      { description: 'kid_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 5 },
      { description: 'female_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 6 },
      { description: 'female_xs', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 7 },
      { description: 'female_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 8 },
      { description: 'female_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 9 },
      { description: 'female_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 10 },
      { description: 'female_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 11 },
      { description: 'male_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 12 },
      { description: 'male_small', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 13 },
      { description: 'male_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 14 },
      { description: 'male_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 15 },
      { description: 'male_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 16 },
      { description: 'male_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 17 },
      { description: 'male_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 18 },
      { description: 'male_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 19 },
      { description: 'male_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 20 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'woman', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 1 },
      { description: 'child', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 2 },
      { description: 'men', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 3 }
    ], {});
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3/4', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 1 },
      { description: 'kid_5/6', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 2 },
      { description: 'kid_7/8', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 3 },
      { description: 'kid_9/11', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 4 },
      { description: 'kid_12/14', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 5 },
      { description: 'female_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 6 },
      { description: 'female_xs', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 7 },
      { description: 'female_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 8 },
      { description: 'female_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 9 },
      { description: 'female_2xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 10 },
      { description: 'female_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 11 },
      { description: 'male_xsmall', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 12 },
      { description: 'male_small', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 13 },
      { description: 'male_medium', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 14 },
      { description: 'male_large', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 15 },
      { description: 'male_xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 16 },
      { description: 'male_xxl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 17 },
      { description: 'male_3xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 18 },
      { description: 'male_4xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 19 },
      { description: 'male_5xl', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 20 }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TShirtTranslations', null, {});
    await queryInterface.bulkDelete('TShirtGroupTranslations', null, {});
  }
};
