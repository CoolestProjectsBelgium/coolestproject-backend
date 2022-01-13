'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'kids', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 4 },
      { description: 'adults', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtGroupId: 5 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'kind', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtGroupId: 4},
      { description: 'volwassen', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtGroupId: 5 }
    ], {});

    await queryInterface.bulkInsert('TShirtGroupTranslations', [
      { description: 'enfant', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtGroupId: 4 },
      { description: 'adulte', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtGroupId: 5}
    ], {});
    
    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kid_3-4', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 21 },
      { description: 'kid_5-6', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 22 },
      { description: 'kid_7-8', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 23 },
      { description: 'kid_9-11', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 24 },
      { description: 'kid_12-14', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 25 },
      { description: 'adults_XXS', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 26 },
      { description: 'adults_XS', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 27 },
      { description: 'adults_S', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 28 },
      { description: 'adults_M', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 29 },
      { description: 'adults_L', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 30 },
      { description: 'adults_XL', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 31 },
      { description: 'adults_XXL', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 32 },
      { description: 'adults_3XL', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 33 },
      { description: 'adults_4XL', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 34 },
      { description: 'adults_5XL', createdAt: new Date(), updatedAt: new Date(), language: 'en', tShirtId: 35 }
    ], {});


    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'kind_3-4', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 21 },
      { description: 'kind_5-6', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 22 },
      { description: 'kind_7-8', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 23 },
      { description: 'kind_9-11', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 24 },
      { description: 'kind_12-14', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 25 },
      { description: 'volwassen_XXS', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 26 },
      { description: 'volwassen_xs',  createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 27 },
      { description: 'volwassen_S',  createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 28 },
      { description: 'volwassen_M', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 29 },
      { description: 'volwassen_L', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 30 },
      { description: 'volwassen_XL', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 31 },
      { description: 'volwassen_XXL', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 32 },
      { description: 'volwassen_3XL', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 33 },
      { description: 'volwassen_4XL', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 34 },
      { description: 'volwassen_5XL', createdAt: new Date(), updatedAt: new Date(), language: 'nl', tShirtId: 35 }
    ], {});


    await queryInterface.bulkInsert('TShirtTranslations', [
      { description: 'enfant_3-4', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 21 },
      { description: 'enfant_5-6', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 22 },
      { description: 'enfant_7-8', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 23 },
      { description: 'enfant_9-11', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 24 },
      { description: 'enfant_12-14', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 25 },
      { description: 'adulte_XXS', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 26 },
      { description: 'adulte_XS', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 27 },
      { description: 'adulte_S', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 28 },
      { description: 'adulte_M', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 29 },
      { description: 'adulte_L', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 30 },
      { description: 'adulte_XL', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 31 },
      { description: 'adulte_XXL', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 32 },
      { description: 'adulte_3XL', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 33 },
      { description: 'adulte_4XL', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 34 },
      { description: 'adulte_5XL', createdAt: new Date(), updatedAt: new Date(), language: 'fr', tShirtId: 35 }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('TShirtTranslations', null, {});
    // await queryInterface.bulkDelete('TShirtGroupTranslations', null, {});
  }
};
