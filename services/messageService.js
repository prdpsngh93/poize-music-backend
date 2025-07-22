// services/messageService.js
const { Message, User } = require('../models');
const { Op } = require("sequelize");

class MessageService {
  async getConversation(currentUserId, otherUserId) {
    return Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: currentUserId }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] }
      ]
    });
  }

  async sendMessage(senderId, receiverId, content) {
    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content
    });

    return Message.findByPk(message.id, {
      include: [{ model: User, as: 'sender', attributes: ['id', 'name'] }]
    });
  }

  async markMessagesAsRead(senderId, receiverId) {
    return Message.update(
      { is_read: true },
      {
        where: {
          sender_id: senderId,
          receiver_id: receiverId,
          is_read: false
        }
      }
    );
  }

  async getConversations(userId) {
    return User.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Message,
          as: 'sentMessages',
          where: { receiver_id: userId },
          required: false
        },
        {
          model: Message,
          as: 'receivedMessages',
          where: { sender_id: userId },
          required: false
        }
      ],
      where: {
        [Op.or]: [
          { '$sentMessages.id$': { [Op.ne]: null } },
          { '$receivedMessages.id$': { [Op.ne]: null } }
        ]
      },
      group: ['User.id']
    });
  }
}

module.exports = new MessageService();