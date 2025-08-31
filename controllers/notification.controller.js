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
