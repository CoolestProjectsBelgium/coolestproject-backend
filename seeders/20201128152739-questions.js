'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Questions', [
      { name: 'Agreed to Photo', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Agreed to Contact', createdAt: new Date(), updatedAt: new Date(), eventId: 1 },
      { name: 'Approved', mandatory: true, createdAt: new Date(), updatedAt: new Date(), eventId: 1 }
    ], {});
    await queryInterface.bulkInsert('QuestionTranslations', [
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Is Coderdojo allowed to take photos/videos during the event?', positive: 'Yes to photo', negative: 'No to photo', questionId: 1 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Can Coderdojo contact you in the future?', positive: 'Yes to contact', negative: 'No to contact', questionId: 2 },
      { language: 'en', createdAt: new Date(), updatedAt: new Date(), description: 'Be sure to read our rules. Do you agree?', positive: 'Yes', negative: 'No', questionId: 3 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: "Coderdojo peut-il prendre des photos / vidéos pendant l'événement?", positive: 'Oui à la photo', negative: 'Non à la photo', questionId: 1 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: "Coderdojo peut-il vous contacter à l'avenir?", positive: "C'est permis", negative: "Plutôt pas", questionId: 2 },
      { language: 'fr', createdAt: new Date(), updatedAt: new Date(), description: "Assurez-vous de lire nos règles. Êtes-vous d'accord?", positive: 'Qui', negative: 'Non', questionId: 3 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: "Mag coderdojo foto's/videos nemen tijdens het evenement?", positive: ' Het mag', negative: 'Neen, liever niet', questionId: 1 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: 'Mag Coderdojo je contacteren in de toekomst?', positive: 'Ja dat mag', negative: 'Neen, liever niet', questionId: 2 },
      { language: 'nl', createdAt: new Date(), updatedAt: new Date(), description: 'Lees zeker onze regels. Ga je akkoord?', positive: 'Ja', negative: 'Neen', questionId: 3 },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Questions', null, {});
    await queryInterface.bulkDelete('QuestionTranslations', null, {});
  }
};
