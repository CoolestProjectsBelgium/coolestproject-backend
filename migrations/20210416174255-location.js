'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Locations', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.STRING
      },
      EventId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Event', key: 'id' },
        unique: false
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

    await queryInterface.removeColumn('Tables', 'location');
    await queryInterface.addColumn('Tables', 'LocationId', { type: Sequelize.INTEGER, references: {
      model: 'Locations',
      key: 'id',
      as: 'LocationId'
    } });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Locations');
    await queryInterface.addColumn('Tables', 'location', { type: Sequelize.CHAR(20) });
  }
};
