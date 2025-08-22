'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('venue_gigs', 'date_time', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('venue_gigs', 'booking_details', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('venue_gigs', 'date_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('venue_gigs', 'booking_details', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
