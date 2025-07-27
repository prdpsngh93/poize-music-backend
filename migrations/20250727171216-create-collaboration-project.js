'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('collaboration_projects', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      project_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      project_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      collaboration_format: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      collaboration_expectations: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      visibility: {
        type: Sequelize.ENUM('private', 'public'),
        allowNull: false,
        defaultValue: 'private',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('collaboration_projects');
  },
};
