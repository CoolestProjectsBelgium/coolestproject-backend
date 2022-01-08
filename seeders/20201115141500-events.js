'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Events', [
      { 
        eventBeginDate: new Date('2021-04-25'), 
        registrationOpenDate: new Date('2021-05-25'), 
        registrationClosedDate: new Date('2021-06-25'),
        projectClosedDate: new Date('2021-07-25'),
        officialStartDate: new Date('2021-08-25'),
        eventEndDate: new Date('2021-09-25'),
        createdAt: new Date(), 
        updatedAt: new Date(), 
        minAge: 7, 
        maxAge: 18, 
        minGuardianAge: 16, 
        maxRegistration: 48, 
        maxVoucher: 3, 
        event_title: 'Coolest Projects 2021'
      },
      { 
        eventBeginDate: new Date('2021-11-01'), 
        registrationOpenDate: new Date('2022-02-01'), 
        registrationClosedDate: new Date('2022-03-31'),
        projectClosedDate: new Date('2022-04-09'),
        officialStartDate: new Date('2022-04-24'),
        eventEndDate: new Date('2022-08-25'),
        createdAt: new Date(), 
        updatedAt: new Date(), 
        minAge: 7, 
        maxAge: 18, 
        minGuardianAge: 16, 
        maxRegistration: 48, 
        maxVoucher: 3, 
        event_title: 'Coolest Projects 2022'
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
