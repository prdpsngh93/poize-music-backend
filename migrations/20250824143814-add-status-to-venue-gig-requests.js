module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('venue_gigs_requests', 'status', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('venue_gigs_requests', 'status');
  },
};
