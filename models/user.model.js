'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
      },
      otp: DataTypes.STRING,
      otp_expiry: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
