'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'music_lover';
    `);
    await queryInterface.sequelize.query(`
      -- Removed 'collaborator', added 'contributor'
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'contributor';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'venue';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    console.warn('Down migration is not supported for ENUM value removal.');
  }
};
