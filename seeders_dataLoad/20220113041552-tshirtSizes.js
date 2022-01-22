'use strict';
var back;
const vname1 = 'TShirtGroups';
const vname2 = 'TShirts';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroups', [
      { name: 'kids', createdAt: new Date(), updatedAt: new Date(), eventId: 2 },
      { name: 'adults', createdAt: new Date(), updatedAt: new Date(), eventId: 2 }
    ], {});
    await queryInterface.bulkInsert('TShirts', [
      { name: 'kid_3-4', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 4 },
      { name: 'kid_5-6', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 4 },
      { name: 'kid_7-8', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 4 },
      { name: 'kid_9-11', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 4 },
      { name: 'kid_12-14', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 4 },
      { name: 'adult_XXS', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_XS', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_S', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_M', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_L', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_XL', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_XXL', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_3XL', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_4XL', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5 },
      { name: 'adult_5XL', createdAt: new Date(), updatedAt: new Date(), eventId: 2, groupId: 5}
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query( `DELETE FROM ${vname1} WHERE EventId = 2;`,back);
    await queryInterface.sequelize.query( `ALTER TABLE ${vname1} AUTO_INCREMENT = 4`,back);
    await queryInterface.sequelize.query( `DELETE FROM ${vname2} WHERE EventId = 2;`,back);
    await queryInterface.sequelize.query( `ALTER TABLE ${vname2} AUTO_INCREMENT = 21;`,back);
  }
};
