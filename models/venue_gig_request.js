'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VenueGigRequest extends Model {
    static associate(models) {
    }
  }

  VenueGigRequest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      gig_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      artist_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      venue_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'VenueGigRequest',
      tableName: 'venue_gigs_requests',
      underscored: true,
    }
  );

  return VenueGigRequest;
};
