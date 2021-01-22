'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [
      { current: true, startDate: new Date('2021-04-25'), createdAt: new Date(), updatedAt: new Date(), minAge: 7, maxAge: 18, minGuardianAge: 16, maxRegistration: 48, maxVoucher: 3, event_title: 'Coolest Projects 2021'}
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
