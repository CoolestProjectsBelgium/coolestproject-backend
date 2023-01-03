'use strict';
const tname = 'ProjectTables';
const tname1 = 'Attachments';
const tname2 = 'Certificates';
const tname3 = 'newsticker';
const tname4 = 'QuestionTranslations';
const tname5 = 'QuestionUsers';
const tname6 = 'TShirtGroupTranslations';
const tname7 = 'TShirtTranslations';
const tname8 = 'PublicVotes';
const tname9 = 'AzureBlobs';
const tname10 = 'Hyperlinks';
const tname11 = 'QuestionRegistrations';
const eField = 'EventId';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(tname, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname, { 
        type: 'foreign key',fields: [eField], name: tname+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });
      await queryInterface.addColumn(tname1, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname1, { 
        type: 'foreign key',fields: ['EventId'], name: tname1+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });  
      await queryInterface.addColumn(tname2, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname2, { 
        type: 'foreign key',fields: ['EventId'], name: tname2+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });  
      await queryInterface.addColumn(tname3, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname3, { 
        type: 'foreign key',fields: ['EventId'], name: tname3+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname4, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname4, { 
        type: 'foreign key',fields: ['EventId'], name: tname4+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname5, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname5, { 
        type: 'foreign key',fields: ['EventId'], name: tname5+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname6, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname6, { 
        type: 'foreign key',fields: ['EventId'], name: tname6+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname7, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname7, { 
        type: 'foreign key',fields: ['EventId'], name: tname7+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname8, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname8, { 
        type: 'foreign key',fields: ['EventId'], name: tname8+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname9, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname9, { 
        type: 'foreign key',fields: ['EventId'], name: tname9+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname10, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname10, { 
        type: 'foreign key',fields: ['EventId'], name: tname10+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname11, 'EventId',{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname11, { 
        type: 'foreign key',fields: ['EventId'], name: tname11+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn(tname, 'eventId');
      // await queryInterface.removeConstraint(tname, 'EventId');
      await queryInterface.removeColumn(tname1, 'EventId');  
      await queryInterface.removeColumn(tname2, 'EventId'); 
      await queryInterface.removeColumn(tname3, 'EventId'); 
      await queryInterface.removeColumn(tname4, 'EventId'); 
      await queryInterface.removeColumn(tname5, 'EventId');
      await queryInterface.removeColumn(tname6, 'EventId'); 
      await queryInterface.removeColumn(tname7, 'EventId'); 
      await queryInterface.removeColumn(tname8, 'EventId'); 
      await queryInterface.removeColumn(tname9, 'EventId'); 
      await queryInterface.removeColumn(tname10, 'EventId'); 
      await queryInterface.removeColumn(tname11, 'EventId');
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
