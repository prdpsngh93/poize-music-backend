"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CollaborationProject extends Model {
    static associate(models) {
      CollaborationProject.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  CollaborationProject.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      project_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      project_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      collaboration_format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      collaboration_expectations: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM("private", "public"),
        allowNull: false,
        defaultValue: "private",
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CollaborationProject",
      tableName: "collaboration_projects",
    }
  );

  return CollaborationProject;
};
