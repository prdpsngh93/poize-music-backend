module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Artists', 'requests_sent', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Artists', 'requests_sent');
  }
};
