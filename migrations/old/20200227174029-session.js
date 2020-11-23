'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Session', {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(100)
      },
      expires: {
        allowNull: false,
        type: Sequelize.DATE
      },
      data: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Session');
  }
};
