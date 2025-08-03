'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContributorGig extends Model {
    static associate(models) {
      // Associate with Collaborator model
      ContributorGig.belongsTo(models.Collaborator, {
        foreignKey: 'collaborator_id',
        as: 'collaborator',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  ContributorGig.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      gig_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      venue_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      musician_id: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      collaborator_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      payment: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      attachment_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'draft',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ContributorGig',
      tableName: 'contributor_gigs',
      underscored: true,
      timestamps: false,
    }
  );

  return ContributorGig;
};
