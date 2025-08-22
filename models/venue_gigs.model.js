'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VenueGig extends Model {
    static associate(models) {
      VenueGig.belongsTo(models.Venue, {
        foreignKey: 'venue_id',
        as: 'venue',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  VenueGig.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    gig_title: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      duration: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      date_time: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      genre: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      artist_type: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      gig_description: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      artist_requirement: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      payment_option: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      perks: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      booking_details: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      venue_id: {
        type: DataTypes.UUID,
        defaultValue: null,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,  
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: null, 
      },
      gig_image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      
  }, {
    sequelize,
    modelName: 'VenueGig',
    tableName: 'venue_gigs',
    underscored: true,
  });

  return VenueGig;
};
