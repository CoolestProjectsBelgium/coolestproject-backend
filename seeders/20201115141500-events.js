'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [
      { current: true, startDate: new Date('2020-05-16'), minAge: 5, maxAge: 18, minGuardianAge: 16, maxRegistration: 20, maxVoucher: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
