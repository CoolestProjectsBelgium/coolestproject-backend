'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tableNumber: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
          as: 'projectId'
        },
        allowNull: false
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

    await queryInterface.addConstraint(
      'Tables',
      ['projectId'],
      {
        type: 'unique',
        name: 'projectId'
      }
    );

    await queryInterface.addConstraint(
      'Tables',
      ['tableNumber'],
      {
        type: 'unique',
        name: 'tableNumber'
      }
    );

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tables');
  }
};
