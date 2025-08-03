'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('Users', 'profile_image'),
      queryInterface.removeColumn('Users', 'bio'),
      queryInterface.removeColumn('Users', 'primary_genre'),
      queryInterface.removeColumn('Users', 'website_url'),
      queryInterface.removeColumn('Users', 'social_media_url'),
      queryInterface.removeColumn('Users', 'availability'),
      queryInterface.removeColumn('Users', 'is_profile_complete')
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn('Users', 'profile_image', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'bio', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'primary_genre', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'website_url', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'social_media_url', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'availability', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'is_profile_complete', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
    ]);
  }
};
