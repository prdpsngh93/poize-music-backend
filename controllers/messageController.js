// controllers/messageController.js
const messageService = require('../services/messageService');

class MessageController {
  async getConversation(req, res) {
    try {
      console.log(" check ----->" , req.user.id);
      console.log(        req.params.userId
      )
      const messages = await messageService.getConversation(
        req.user.id,
        req.params.userId
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { receiver_id, content } = req.body;
      const message = await messageService.sendMessage(
        req.user.id,
        receiver_id,
        content
      );
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      await messageService.markMessagesAsRead(
        req.body.senderId,
        req.user.id
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getConversations(req, res) {
    try {
      const conversations = await messageService.getConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MessageController();