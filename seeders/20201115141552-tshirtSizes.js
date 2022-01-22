'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TShirtGroups', [
      { name: 'woman', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1 },
      { name: 'child', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1 },
      { name: 'men', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1 }
    ], {});
    await queryInterface.bulkInsert('TShirts', [
      { name: 'kid_3/4', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 2 },
      { name: 'kid_5/6', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 2 },
      { name: 'kid_7/8', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 2 },
      { name: 'kid_9/11', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 2 },
      { name: 'kid_12/14', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 2 },
      { name: 'female_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'female_xs', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'female_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'female_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'female_2xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'female_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 1 },
      { name: 'male_xsmall', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_small', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_xxl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_4xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 },
      { name: 'male_5xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: 1, groupId: 3 }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TShirts', null, {});
    await queryInterface.bulkDelete('TShirtGroups', null, {});
  }
};
