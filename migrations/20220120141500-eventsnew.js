'use strict';
const tname = 'Eventsnew';

var back;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn(tname, 'startDate', 'officialStartDate');
      await queryInterface.removeColumn(tname, 'current');
      await queryInterface.removeColumn(tname, 'closed');
      await queryInterface.addColumn(tname, 'eventBeginDate',{ type: Sequelize.DATE});
      await queryInterface.addColumn(tname, 'registrationOpenDate',{ type: Sequelize.DATE});
      await queryInterface.addColumn(tname, 'registrationClosedDate',{ type: Sequelize.DATE});
      await queryInterface.addColumn(tname, 'projectClosedDate',{ type: Sequelize.DATE});
      await queryInterface.addColumn(tname, 'eventEndDate',{ type: Sequelize.DATE});

      await queryInterface.sequelize.query(`
        UPDATE ${tname} SET 
            createdAt  = '2021-01-31 22:31:52',
            updatedAt  = '2021-04-25 19:10:09',
            azure_storage_container  = 'coolestproject',
            maxFileSize  = 2147483648,
            eventBeginDate  = '2020-11-01 00:00:00',
            registrationOpenDate  = '2021-02-01 00:00:00',
            registrationClosedDate  = '2021-04-01 00:00:00',
            projectClosedDate  = '2021-04-09 00:00:00',
            eventEndDate = '2021-08-15 00:00:00'
            WHERE id = 1;
      `,back
      ),

      await queryInterface.bulkInsert(tname, [
        { 
          azure_storage_container: 'coolestproject22',
          maxFileSize: 2147483648,
          eventBeginDate: new Date('2021-11-01'), 
          registrationOpenDate: new Date('2022-02-01'), 
          registrationClosedDate: new Date('2022-03-31'),
          projectClosedDate: new Date('2022-04-09'),
          officialStartDate: new Date('2022-04-24'),
          eventEndDate: new Date('2022-08-25'),
          createdAt: new Date(), 
          updatedAt: new Date(), 
          minAge: 7, 
          maxAge: 18, 
          minGuardianAge: 16, 
          maxRegistration: 48, 
          maxVoucher: 3, 
          event_title: 'Coolest Projects 2022'
        }
      ], {});
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(`Delete FROM ${tname}  WHERE id = 2;`,back);
      await queryInterface.removeColumn(tname, 'eventBeginDate');
      await queryInterface.removeColumn(tname, 'registrationOpenDate');
      await queryInterface.removeColumn(tname, 'registrationClosedDate');
      await queryInterface.removeColumn(tname, 'projectClosedDate');
      await queryInterface.removeColumn(tname, 'eventEndDate');
      await queryInterface.addColumn(tname, 'current',{ type: Sequelize.BOOLEAN });
      await queryInterface.addColumn(tname, 'closed',{ type: Sequelize.BOOLEAN });
      await queryInterface.renameColumn(tname, 'officialStartDate','startDate');
      await queryInterface.sequelize.query(`UPDATE ${tname} SET closed = 1 WHERE id = 1;`,back);
      await queryInterface.sequelize.query( `ALTER TABLE ${tname} AUTO_INCREMENT = 1;`,back);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
