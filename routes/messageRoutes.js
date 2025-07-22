// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get conversation between two users
router.get('/conversation/:userId', messageController.getConversation);

// Send a message
router.post('/', messageController.sendMessage);

// Mark messages as read
router.put('/read', messageController.markAsRead);

// Get conversations list
router.get('/conversations', messageController.getConversations);

module.exports = router;