'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Questions', [
      // Event 2  first ALTER TABLE Questions AUTO_INCREMENT = 5;
      { name: 'Agreed to Photo', createdAt: new Date(), updatedAt: new Date(), eventId: 2 },
      { name: 'Agreed to Contact', createdAt: new Date(), updatedAt: new Date(), eventId: 2 },
      { name: 'Approved', mandatory: true, createdAt: new Date(), updatedAt: new Date(), eventId: 2 }
    ], {});
    await queryInterface.bulkInsert('QuestionTranslations', [
      // Event 2 first ALTER TABLE QuestionTranslations AUTO_INCREMENT = 13;
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Is Coderdojo allowed to take photos/videos during the event?', positive: 'Yes to photo', negative: 'No to photo', questionId: 5 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Can Coderdojo contact you in the future?', positive: 'Yes to contact', negative: 'No to contact', questionId: 6 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Be sure to read our rules. Do you agree?', positive: 'Yes', negative: 'No', questionId: 7 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: 'Coderdojo peut-il prendre des photos / vidéos pendant l\'événement?', positive: 'Oui à la photo', negative: 'Non à la photo', questionId: 5 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: 'Coderdojo peut-il vous contacter à l\'avenir?', positive: 'C\'est permis', negative: 'Plutôt pas', questionId: 6 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: 'Assurez-vous de lire nos règles. Êtes-vous d\'accord?', positive: 'Oui', negative: 'Non', questionId: 7 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: 'Mag coderdojo foto\'s/video\'s nemen tijdens het evenement?', positive: 'Ja, dat mag', negative: 'Neen, liever niet', questionId: 5 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: 'Mag Coderdojo je contacteren in de toekomst?', positive: 'Ja, dat mag', negative: 'Neen, liever niet', questionId: 6 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: 'Lees zeker onze regels. Ga je akkoord?', positive: 'Ja', negative: 'Neen', questionId: 7 }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    // delete records 5-7 (eventId 2) in questions and >12 in QuestionTranslations
    //    await queryInterface.bulkDelete('Questions', null, {});
    //    await queryInterface.bulkDelete('QuestionTranslations', null, {});
    // ALTER TABLE Questions AUTO_INCREMENT = 5;
    // ALTER TABLE QuestionTranslations AUTO_INCREMENT = 13;
  }
};
