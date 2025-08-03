'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('venues', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      venue_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      venue_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      venue_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      venue_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      venue_logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      venue_gallery: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      genre_tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      artist_types: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      venue_hours: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      manager_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      booking_information: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      venue_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      available_equipment: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      venue_website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_profile_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('venues');
  }
};
