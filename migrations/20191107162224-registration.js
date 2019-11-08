'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postalcode: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.ENUM('m', 'v', 'x')
      },
      general_questions_json: {
        type: Sequelize.JSON
      },
      mandatory_approvals_json: {
        type: Sequelize.JSON
      },
      birthmonth: {
        type: Sequelize.DATEONLY
      },
      size: {
        type: Sequelize.ENUM('s','m','l','xl','xxl','3xl')
      },
      type: {
        type: Sequelize.ENUM('m', 'v')
      },
      via: {
        type: Sequelize.STRING
      },
      medical: {
        type: Sequelize.STRING
      },
      extra: {
        type: Sequelize.STRING
      },
      project_code: {
        type: Sequelize.UUID
      },
      project_name: {
        type: Sequelize.STRING
      },
      project_descr: {
        type: Sequelize.STRING
      },
      project_type: {
        type: Sequelize.STRING
      },
      project_lang: {
        type: Sequelize.ENUM('nl','fr','en')
      },
      gsm: {
        type: Sequelize.STRING
      },
      gsm_guardian: {
        type: Sequelize.STRING
      },
      email_guardian: {
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
