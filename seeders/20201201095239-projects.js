'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Projects', [
      {
        project_name: 'Mijn tof project',
        createdAt: new Date(),
        updatedAt: new Date(),
        eventId: 1,
        project_descr: 'Dit is zo leuk',
        project_type: 'test',
        project_lang: 'nl',
        max_tokens: 2,
        userId: 1
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Projects', null, {});
  }
};
