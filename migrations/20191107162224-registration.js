'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postalcode: {
        allowNull: false,
        type: Sequelize.INTEGER,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(254)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      firstname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false,
        type: Sequelize.ENUM('m', 'f', 'x')
      },
      language: {
        allowNull: false,
        type: Sequelize.ENUM('nl', 'fr', 'en')
      },
      general_questions: {
        type: Sequelize.JSON
      },
      mandatory_approvals: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      birthmonth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      t_size: {
        type: Sequelize.ENUM(
          'female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
          'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
          'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
          'male_medium','male_large','male_xl','male_xxl','male_3xl'
        ),
        allowNull: false
      },
      via: {
        type: Sequelize.STRING
      },
      medical: {
        type: Sequelize.STRING
      },
      project_code: {
        type: Sequelize.UUID
      },
      project_name: {
        type: Sequelize.STRING(100)
      },
      project_descr: {
        type: Sequelize.STRING(4000)
      },
      project_type: {
        type: Sequelize.STRING(100)
      },
      project_lang: {
        type: Sequelize.ENUM('nl','fr','en','niet bellen')
      },
      gsm: {
        type: Sequelize.STRING(13)
      },
      gsm_guardian: {
        type: Sequelize.STRING(13)
      },
      email_guardian: {
        type: Sequelize.STRING(254)
      },
      waiting_list: {
        type: Sequelize.BOOLEAN
      }
    });

    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      last_token: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      postalcode: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      language: {
        allowNull: false,
        type: Sequelize.ENUM('nl', 'fr', 'en')
      },
      email: {
        type: Sequelize.STRING(254)
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sex: {
        type: Sequelize.ENUM('m', 'f', 'x'),
        allowNull: false
      },
      general_questions: {
        type: Sequelize.JSON
      },
      mandatory_approvals: {
        type: Sequelize.JSON,
        allowNull: false
      },
      birthmonth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      t_size: {
        type: Sequelize.ENUM(
          'female_M116','female_M122','female_M128','female_M134','female_M146','female_M152','female_M158','female_M164',
          'female_M170','female_M176','female_medium','female_large','female_xl','male_M116','male_M122','male_M128','male_M134',
          'male_M140','male_M146','male_M152','male_M158','male_M164','male_M170','male_M176','male_Xsmall','male_small',
          'male_medium','male_large','male_xl','male_xxl','male_3xl'    
        ),
        allowNull: false
      },
      via: {
        type: Sequelize.STRING
      },
      medical: {
        type: Sequelize.STRING
      },
      gsm: {
        type: Sequelize.STRING(13)
      },
      gsm_guardian: {
        type: Sequelize.STRING(13)
      },
      email_guardian: {
        type: Sequelize.STRING(254)
      }
    });

    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      project_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      project_descr: {
        type: Sequelize.STRING(4000),
        allowNull: false
      },
      project_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      project_lang: {
        type: Sequelize.ENUM('nl','fr','en','niet bellen'),
        allowNull: false
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'ownerId'
        },
        onDelete: 'cascade',
        allowNull: false        
      }
    }); 

    await queryInterface.createTable('Vouchers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
          as: 'projectId'
        },
        onDelete: 'cascade',
        allowNull: false 
      },
      participantId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'participantId'
        },
        onDelete: 'cascade',
        allowNull: true 
      }
    });    

    await queryInterface.addConstraint(
      'Vouchers',
      ['projectId','participantId'],
      {
        type: 'unique',
        name: 'project_participants'
      }
    );

    await queryInterface.addConstraint(
      'Users',
      ['email'],
      {
        type: 'unique',
        name: 'email'
      }
    );

    await queryInterface.addConstraint(
      'Projects',
      ['ownerId'],
      {
        type: 'unique',
        name: 'owner'
      }
    );

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
