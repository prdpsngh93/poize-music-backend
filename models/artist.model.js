'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artist extends Model {
    static associate(models) {
      Artist.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Artist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      bio: DataTypes.TEXT,
      profile_picture: DataTypes.STRING,
      location: DataTypes.STRING,
      genre: DataTypes.STRING,
      website_url: DataTypes.STRING,
      social_media_link: DataTypes.STRING,
      work_sample: DataTypes.STRING,
      gigs_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Artist',
    }
  );

  return Artist;
};
