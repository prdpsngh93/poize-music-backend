// models/Notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { // who receives this notification
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: { // "post" | "chat" | "invite"
        type: DataTypes.STRING,
        allowNull: false,
      },
      reference_id: { // id of the post, chat, or invite
        type: DataTypes.UUID,
      },
      message: { // short text to display
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    });
    return Notification;
  };
  