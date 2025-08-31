const { Notification } = require("../models");

// Get all unread notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you have auth middleware
    const notifications = await Notification.findAll({
      where: { user_id: userId, is_read: false },
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await Notification.update(
      { is_read: true },
      { where: { id, user_id: userId } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, type, reference_id, message } = req.body;

    if (!user_id || !type || !message) {
      return res.status(400).json({ error: "user_id, type, and message are required" });
    }

    const notification = await Notification.create({
      user_id,
      type,
      reference_id,
      message,
    });

    res.status(201).json(notification);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create notification" });
  }
};