'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Locations', [
      { text: 'Zaal 1', createdAt: new Date(), updatedAt: new Date(), EventId: 2},
      { text: 'Zaal 2', createdAt: new Date(), updatedAt: new Date(), EventId: 2},
      { text: 'Zaal 3', createdAt: new Date(), updatedAt: new Date(), EventId: 2}
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('Locations', null, {});
  }
};
