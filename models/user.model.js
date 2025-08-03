'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      }
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
