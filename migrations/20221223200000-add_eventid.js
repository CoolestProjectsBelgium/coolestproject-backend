'use strict';
/*
Add EventId to the following tables with foreign key relation ship to table Event
*/ 
const eField = 'EventId'; //Field name to add
//const tname = 'ProjectTables';
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


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      /* Table build up from scratch directly in the db 
      await queryInterface.addColumn(tname, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname, { 
        type: 'foreign key',fields: [eField], name: tname+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });*/
      await queryInterface.addColumn(tname1, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname1, { 
        type: 'foreign key',fields: [eField], name: tname1+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });  
      await queryInterface.addColumn(tname2, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname2, { 
        type: 'foreign key',fields: [eField], name: tname2+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      });  
      await queryInterface.addColumn(tname3, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname3, { 
        type: 'foreign key',fields: [eField], name: tname3+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname4, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname4, { 
        type: 'foreign key',fields: [eField], name: tname4+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname5, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname5, { 
        type: 'foreign key',fields: [eField], name: tname5+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname6, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname6, { 
        type: 'foreign key',fields: [eField], name: tname6+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname7, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname7, { 
        type: 'foreign key',fields: [eField], name: tname7+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname8, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname8, { 
        type: 'foreign key',fields: [eField], name: tname8+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname9, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname9, { 
        type: 'foreign key',fields: [eField], name: tname9+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname10, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname10, { 
        type: 'foreign key',fields: [eField], name: tname10+'_Events_id_fkey',
        references: {table: 'Events',field: 'id'}
      }); 
      await queryInterface.addColumn(tname11, eField,{ type: Sequelize.INTEGER });
      await queryInterface.addConstraint(tname11, { 
        type: 'foreign key',fields: [eField], name: tname11+'_Events_id_fkey',
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
      //await queryInterface.removeColumn(tname, eField);
      await queryInterface.removeColumn(tname1, eField);  
      await queryInterface.removeColumn(tname2, eField); 
      await queryInterface.removeColumn(tname3, eField); 
      await queryInterface.removeColumn(tname4, eField); 
      await queryInterface.removeColumn(tname5, eField);
      await queryInterface.removeColumn(tname6, eField); 
      await queryInterface.removeColumn(tname7, eField); 
      await queryInterface.removeColumn(tname8, eField); 
      await queryInterface.removeColumn(tname9, eField); 
      await queryInterface.removeColumn(tname10, eField); 
      await queryInterface.removeColumn(tname11, eField);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
