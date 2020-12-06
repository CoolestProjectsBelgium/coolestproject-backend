'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Questions', [
      { name: 'No Photo', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'No Contact', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Approved', mandatory: true, createdAt: new Date(), updatedAt: new Date(), eventId: 1 }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
