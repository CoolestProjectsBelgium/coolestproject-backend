'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        language: 'nl',
        postalcode: 1500,
        municipality_name: 'Halle',
        street: 'Dummystraat',
        house_number: '10',
        email: 'test@test.be',
        firstname: 'Test name 1',
        lastname: 'Testnaam',
        sex: 'm',
        birthmonth: new Date('01-12-2004'),
        via: 'Mijn dojo',
        gsm: '123456789',
        gsm_guardian: '123456789',
        email_guardian: 'test@guardian.be',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        language: 'nl',
        postalcode: 1500,
        municipality_name: 'Halle',
        street: 'Dummystraat',
        house_number: '10',
        email: 'test1@test.be',
        firstname: 'Test name 2',
        lastname: 'Testnaam',
        sex: 'm',
        birthmonth: new Date('01-12-2004'),
        via: 'Mijn dojo',
        gsm: '123456789',
        gsm_guardian: '123456789',
        email_guardian: 'test@guardian.be',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
