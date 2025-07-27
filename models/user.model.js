'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model { }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Sequelize will auto-generate UUIDs
        primaryKey: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM('artist', 'music_lover', 'collaborator', 'venue'),
        allowNull: true,
        defaultValue: null,
      },
      otp: DataTypes.STRING,
      otp_expiry: DataTypes.DATE,
      is_oauth_login: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primary_genre: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      social_media_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_profile_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
