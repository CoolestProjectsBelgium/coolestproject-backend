'use strict';
const tname = 'Eventsnew';

var back;
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Eventsnew', 'startDate', 'officialStartDate');
    await queryInterface.removeColumn('Eventsnew', 'current');
    await queryInterface.removeColumn('Eventsnew', 'closed');
    await queryInterface.addColumn('Eventsnew', 'eventBeginDate',{ type: Sequelize.DATE});
    await queryInterface.addColumn('Eventsnew', 'registrationOpenDate',{ type: Sequelize.DATE});
    await queryInterface.addColumn('Eventsnew', 'registrationClosedDate',{ type: Sequelize.DATE});
    await queryInterface.addColumn('Eventsnew', 'projectClosedDate',{ type: Sequelize.DATE});
    await queryInterface.addColumn('Eventsnew', 'eventEndDate',{ type: Sequelize.DATE});

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

    await queryInterface.bulkInsert('Eventsnew', [
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
  },

  

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`Delete FROM ${tname}  WHERE id = 2;`,back);
    await queryInterface.removeColumn('Eventsnew', 'eventBeginDate');
    await queryInterface.removeColumn('Eventsnew', 'registrationOpenDate');
    await queryInterface.removeColumn('Eventsnew', 'registrationClosedDate');
    await queryInterface.removeColumn('Eventsnew', 'projectClosedDate');
    await queryInterface.removeColumn('Eventsnew', 'eventEndDate');
    await queryInterface.addColumn('Eventsnew', 'current',{ type: Sequelize.BOOLEAN });
    await queryInterface.addColumn('Eventsnew', 'closed',{ type: Sequelize.BOOLEAN });
    await queryInterface.renameColumn('Eventsnew', 'officialStartDate','startDate');
    await queryInterface.sequelize.query(`UPDATE ${tname} SET closed = 1 WHERE id = 1;`,back);
    await queryInterface.sequelize.query( `ALTER TABLE ${tname} AUTO_INCREMENT = 1;`,back);
  }
};
