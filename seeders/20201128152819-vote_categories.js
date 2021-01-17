'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('VoteCategories', [
      { name: 'Complexity', min: 0, max: 100, createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Art', min: 0, max: 100, createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Originality', min: 0, max: 100, createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Public', min: 0, max: 100, createdAt: new Date(), updatedAt: new Date(), eventId: 1, public: true }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('VoteCategories', null, {});
  }
};