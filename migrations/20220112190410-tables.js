'use strict';
var back;
const vname1 = 'Tables';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Tables', [
      { name: 'Tafel 1', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 1, maxPlaces: 4 },
      { name: 'Tafel 2', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 1, maxPlaces: 4 },
      { name: 'Tafel 3', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 1, maxPlaces: 4 },
      { name: 'Tafel 4', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 2, maxPlaces: 4 },
      { name: 'Tafel 5', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 2, maxPlaces: 4 },
      { name: 'Tafel 6', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 2, maxPlaces: 4 },
      { name: 'Tafel 7', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 3, maxPlaces: 4 },
      { name: 'Tafel 8', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 3, maxPlaces: 4 },
      { name: 'Tafel 9', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 3, maxPlaces: 4 },
      { name: 'Tafel 10', createdAt: new Date(), updatedAt: new Date(), EventId: 2, LocationId: 3, maxPlaces: 4 }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query( `DELETE FROM ${vname1} WHERE EventId = 2;`,back);
    await queryInterface.sequelize.query( `ALTER TABLE ${vname1} AUTO_INCREMENT = 77;`,back);
  }
};
