'use strict';

const addDays = require('date-fns/addDays');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Events
    await queryInterface.bulkInsert('Events', [
      { 
        eventBeginDate: new Date('2021-04-25'), 
        registrationOpenDate: new Date('2021-05-25'), 
        registrationClosedDate: new Date('2021-06-25'),
        projectClosedDate: new Date('2021-07-25'),
        officialStartDate: new Date('2021-08-25'),
        eventEndDate: new Date('2021-09-25'),
        createdAt: new Date(), 
        updatedAt: new Date(), 
        minAge: 7, 
        maxAge: 18, 
        minGuardianAge: 16, 
        maxRegistration: 48, 
        maxVoucher: 3, 
        event_title: 'Closed Event'
      },
      { 
        eventBeginDate: addDays(new Date(), -10), 
        registrationOpenDate: addDays(new Date(), -10), 
        registrationClosedDate: addDays(new Date(), 10),
        projectClosedDate: addDays(new Date(), 20),
        officialStartDate: addDays(new Date(), 15),
        eventEndDate: addDays(new Date(), 30),
        createdAt: new Date(), 
        updatedAt: new Date(), 
        minAge: 7, 
        maxAge: 18, 
        minGuardianAge: 16, 
        maxRegistration: 48, 
        maxVoucher: 3, 
        event_title: 'Open Event'
      }
    ], {});

    const activeEvent = 2;

    // Tshirts
    await queryInterface.bulkInsert('TShirtGroups', [
      { name: 'woman', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent },
      { name: 'child', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent },
      { name: 'men', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent }
    ], {});
    await queryInterface.bulkInsert('TShirts', [
      { name: 'kid_3/4', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 2 },
      { name: 'kid_5/6', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 2 },
      { name: 'kid_7/8', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 2 },
      { name: 'kid_9/11', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 2 },
      { name: 'kid_12/14', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 2 },

      { name: 'female_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },
      { name: 'female_xs', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },
      { name: 'female_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },
      { name: 'female_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },
      { name: 'female_2xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },
      { name: 'female_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 1 },

      { name: 'male_xsmall', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_small', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_medium', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_large', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_xxl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_3xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_4xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 },
      { name: 'male_5xl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent, groupId: 3 }
    ], {});

    // Questions
    await queryInterface.bulkInsert('Questions', [
      { name: 'Agreed to Photo', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent },
      { name: 'Agreed to Contact', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent },
      { name: 'Approved', mandatory: true, createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent },
      { name: 'CliniMaker', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), eventId: activeEvent }
    ], {});
    await queryInterface.bulkInsert('QuestionTranslations', [
      { language: 'en', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Is Coderdojo allowed to take photos/videos during the event?', positive: 'Yes to photo', negative: 'No to photo', questionId: 1 },
      { language: 'en', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Can Coderdojo contact you in the future?', positive: 'Yes to contact', negative: 'No to contact', questionId: 2 },
      { language: 'en', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Be sure to read our rules. Do you agree?', positive: 'Yes', negative: 'No', questionId: 3 },
      { language: 'en', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Could your project qualify as a CliniMakers project? In other words: do you plan to make something for a child that is ill or has a disability and you (preferably) know this person.', positive: 'Yes', negative: 'No', questionId: 4 },
      { language: 'fr', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Coderdojo peut-il prendre des photos / vidéos pendant l\'événement?', positive: 'Oui à la photo', negative: 'Non à la photo', questionId: 1 },
      { language: 'fr', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Coderdojo peut-il vous contacter à l\'avenir?', positive: 'C\'est permis', negative: 'Plutôt pas', questionId: 2 },
      { language: 'fr', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Assurez-vous de lire nos règles. Êtes-vous d\'accord?', positive: 'Oui', negative: 'Non', questionId: 3 },
      { language: 'fr', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Votre projet est-il éligible aux CliniMakers? En d\'autres termes: faites-vous quelque chose pour un enfant malade ou handicapé et connaissez-vous (de préférence) la personne vous-même.', positive: 'Oui', negative: 'Non', questionId: 4 },
      { language: 'nl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Mag coderdojo foto\'s/video\'s nemen tijdens het evenement?', positive: 'Ja, dat mag', negative: 'Neen, liever niet', questionId: 1 },
      { language: 'nl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Mag Coderdojo je contacteren in de toekomst?', positive: 'Ja, dat mag', negative: 'Neen, liever niet', questionId: 2 },
      { language: 'nl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Lees zeker onze regels. Ga je akkoord?', positive: 'Ja', negative: 'Neen', questionId: 3 },
      { language: 'nl', createdAt: '2021-01-31 22:31:55', updatedAt: new Date(), description: 'Komt jouw project in aanmerking voor de CliniMakers? Dus maak jij iets voor een kind die ziek is of een beperking heeft én (liefst) ken je de persoon ook zelf.', positive: 'Ja', negative: 'Neen', questionId: 4 }
    ], {});

  },

  down: async (queryInterface, Sequelize) => {}
};
