'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Artists', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      bio: {
        type: Sequelize.TEXT
      },
      profile_picture: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      website_url: {
        type: Sequelize.STRING
      },
      social_media_link: {
        type: Sequelize.STRING
      },
      work_sample: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Artists');
  }
};
