'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Questions', [
      { name: 'No Photo', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'No Contact', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Approved', mandatory: true, createdAt: new Date(), updatedAt: new Date(), eventId: 1 }
    ], {});
    await queryInterface.bulkInsert('QuestionTranslations', [
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'No Photo description', positive: 'Yes to photo', negative: 'No to photo', questionId: 1 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'No Contact description', positive: 'Yes to contact', negative: 'No to contact', questionId: 2 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Approve general', positive: 'Yes', negative: 'No', questionId: 3 },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Questions', null, {});
    await queryInterface.bulkDelete('QuestionTranslations', null, {});
  }
};
