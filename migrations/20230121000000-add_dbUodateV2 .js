
'use strict'; 

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.sequelize.query( ' ALTER TABLE `Registrations` CHANGE COLUMN `postalcode` `postalcode` INT NULL ;',
          { transaction: t }),
        queryInterface.sequelize.query( ' ALTER TABLE `Users` CHANGE COLUMN `postalcode` `postalcode` INT NULL ;',
          { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.sequelize.query(' UPDATE Registrations SET `postalcode` = \'9999\' WHERE `postalcode` IS NULL;',
          { transaction: t }),
        queryInterface.sequelize.query(' ALTER TABLE Registrations CHANGE COLUMN `postalcode` `postalcode` INT NOT NULL;',
          { transaction: t }),
        queryInterface.sequelize.query(' UPDATE Users SET `postalcode` = \'9999\' WHERE `postalcode` IS NULL;',
          { transaction: t }),
        queryInterface.sequelize.query(' ALTER TABLE Users CHANGE COLUMN `postalcode` `postalcode` INT NOT NULL;',
          { transaction: t }),
      ]);
    });
  }
};