'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('contributor_gig_requests', 'performance_terms', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contributor_gig_requests', 'cancellation_policy', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('contributor_gig_requests', 'payment_terms', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('contributor_gig_requests', 'performance_terms');
    await queryInterface.removeColumn('contributor_gig_requests', 'cancellation_policy');
    await queryInterface.removeColumn('contributor_gig_requests', 'payment_terms');
  }
};
