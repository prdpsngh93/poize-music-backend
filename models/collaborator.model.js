'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Collaborator extends Model {
    static associate(models) {
      Collaborator.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Collaborator.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue:null
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      skill_tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      social_media_link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work_sample: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      short_bio: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_type: {  // ✅ New field
        type: DataTypes.STRING,
        allowNull: true,
      },
      contributor_role: { // ✅ New field
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Collaborator',
      tableName: 'collaborators',
      timestamps: true,
    }
  );

  return Collaborator;
};
