'use strict';
var back;
const vname1 = 'Locations';

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
    await queryInterface.sequelize.query( `DELETE FROM ${vname1} WHERE EventId = 2;`,back);
    await queryInterface.sequelize.query( `ALTER TABLE ${vname1} AUTO_INCREMENT = 7;`,back);
  }
};
