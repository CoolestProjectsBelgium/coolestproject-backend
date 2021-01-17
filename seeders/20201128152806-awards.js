'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Awards', [
      { name: 'Complexity', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Public', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Awards', null, {});
  }
};
