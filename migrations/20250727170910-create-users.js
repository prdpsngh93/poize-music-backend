'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable UUID extension in PostgreSQL
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM('artist', 'listener', 'producer'),
        allowNull: true,
        defaultValue: null,
      },
      otp: {
        type: Sequelize.STRING,
      },
      otp_expiry: {
        type: Sequelize.DATE,
      },
      is_oauth_login: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      profile_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      primary_genre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      social_media_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_profile_complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
