'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove existing default constraint (if any)
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" DROP DEFAULT;
    `);

    // 2. Change column to ENUM
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('artist', 'listener', 'producer'),
      allowNull: true,
    });

    // 3. Set new default (null doesn't need explicit DEFAULT)
    // But if you want to ensure default null:
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // 1. Revert back to STRING
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });

    // 2. Drop ENUM type to clean up
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_Users_role";
    `);
  }
};
