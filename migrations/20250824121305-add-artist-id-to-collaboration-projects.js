'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("collaboration_projects", "artist_id", {
      type: Sequelize.STRING,
      allowNull: true, // change to false if you want it required
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("collaboration_projects", "artist_id");
  },
};
