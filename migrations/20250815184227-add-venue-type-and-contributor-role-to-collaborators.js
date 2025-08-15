'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('collaborators', 'venue_type', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('collaborators', 'contributor_role', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('collaborators', 'venue_type');
    await queryInterface.removeColumn('collaborators', 'contributor_role');
  }
};
