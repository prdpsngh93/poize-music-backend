'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Venue.init(
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
      venue_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      venue_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_gallery: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      genre_tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      artist_types: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      venue_hours: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      manager_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      booking_information: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      venue_capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      available_equipment: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      venue_website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      is_profile_complete:{
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Optional: set default value
        allowNull: false,    // Optional: force it to always be true/false
      }
    },
    {
      sequelize,
      modelName: 'Venue',
      tableName: 'venues',
      timestamps: true,
    }
  );

  return Venue;
};
