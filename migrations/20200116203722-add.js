'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // add new enumeration
    await queryInterface.changeColumn('Registrations', 't_size', {
      type: Sequelize.ENUM('female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
      'female_M170','female_M176','female_xs','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
      'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
      'male_medium','male_large','male_xl','male_xxl','male_3xl', 
      'kid_3/4' , 'kid_5/6', 'kid_7/8', 'kid_9/11', 'kid_12/14', 'male_4xl', 'male_5xl', 'female_2xl', 'female_3xl'), // new data
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 't_size', {
      type: Sequelize.ENUM('female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
      'female_M170','female_M176','female_xs','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
      'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
      'male_medium','male_large','male_xl','male_xxl','male_3xl', 'kid_3/4' , 'kid_5/6', 'kid_7/8', 'kid_9/11', 
      'kid_12/14', 'male_4xl', 'male_5xl', 'female_2xl', 'female_3xl'),
      allowNull: false
    });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Registrations', 't_size', {
      type: Sequelize.ENUM('female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
      'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
      'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
      'male_medium','male_large','male_xl','male_xxl','male_3xl'),
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 't_size', {
      type: Sequelize.ENUM('female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
      'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
      'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
      'male_medium','male_large','male_xl','male_xxl','male_3xl'),
      allowNull: false
    });
  }
};