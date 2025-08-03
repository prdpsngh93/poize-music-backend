'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MusicLover extends Model {
    static associate(models) {
      MusicLover.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  MusicLover.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      favourite_genre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      favourite_artist: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      preferred: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gigs_near_me: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      artist_updates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'MusicLover',
      tableName: 'music_lover',
      timestamps: true,
    }
  );

  return MusicLover;
};
