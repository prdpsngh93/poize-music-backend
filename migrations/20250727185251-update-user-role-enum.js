'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new values to ENUM type
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'music_lover';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'collaborator';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'venue';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // WARNING: PostgreSQL does not support removing ENUM values directly.
    // This "down" is not reversible unless you recreate the enum type.
    // You could optionally document that this is a one-way migration.
    console.warn('Down migration is not supported for ENUM value removal.');
  }
};
