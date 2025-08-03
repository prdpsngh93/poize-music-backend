'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('venue_gigs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      gig_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      artist_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gig_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      artist_requirement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      payment_option: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      perks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      booking_details: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      venue_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'venues',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('venue_gigs');
  },
};
