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
      last_token: {
        type: Sequelize.DATE,
        allowNull: true
      },
      t_size: {
        type: Sequelize.ENUM(
          'female_small','female_medium','female_large','female_xl','female_xxl','female_3xl',
          'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl'
        ),
        allowNull: false
      },
      via: {
        type: Sequelize.STRING
      },
      medical: {
        type: Sequelize.STRING
      },
      extra: {
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
        type: Sequelize.STRING(500)
      },
      project_lang: {
        type: Sequelize.ENUM('nl','fr','en')
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

    await queryInterface.createTable('Users', {
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
          'female_small','female_medium','female_large','female_xl','female_xxl','female_3xl',
          'male_small', 'male_medium', 'male_large', 'male_xl', 'male_xxl', 'male_3xl'
        ),
        allowNull: false
      },
      via: {
        type: Sequelize.STRING
      },
      medical: {
        type: Sequelize.STRING
      },
      extra: {
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
        type: Sequelize.JSON,
        allowNull: false
      },
      project_lang: {
        type: Sequelize.ENUM('nl','fr','en'),
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
