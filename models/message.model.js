'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'messages',
    timestamps: true
  });

  // Optional: Add virtual associations (won't affect User model)
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'sender_id',
      as: 'sender',
      constraints: false
    });

    Message.belongsTo(models.User, {
      foreignKey: 'receiver_id',
      as: 'receiver',
      constraints: false
    });
  };

  return Message;
};
