'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('Questions', { 
        fields: ['eventId', 'name'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Questions', 'name');

      await queryInterface.addConstraint('Registration', { 
        fields: ['email', 'eventId'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Registration', 'email');

      await queryInterface.addConstraint('TShirtGroups', { 
        fields: ['name', 'eventId'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('TShirtGroups', 'name');

      await queryInterface.addConstraint('TShirts', { 
        fields: ['name', 'eventId'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('TShirts', 'name');

      await queryInterface.addConstraint('Users', { 
        fields: ['email', 'eventId'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Users', 'email');

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint('Questions', { 
        fields: ['name'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Questions', 'questions_event_id_name');

      await queryInterface.addConstraint('Registrations', { 
        fields: ['email'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Registrations', 'registrations_event_id_email');

      await queryInterface.addConstraint('TShirtGroups', { 
        fields: ['name'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('TShirtGroups', 'tshirtgroups_event_id_name');

      await queryInterface.addConstraint('TShirts', { 
        fields: ['name'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('TShirts', 'tshirts_event_id_name');

      await queryInterface.addConstraint('Users', { 
        fields: ['email'],
        type: 'UNIQUE'
      });
      await queryInterface.removeConstraint('Users', 'users_event_id_email');

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
