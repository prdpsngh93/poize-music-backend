const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead } = require("../controllers/notification.controller");

const auth = require("../middlewares/authMiddleware"); 

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markAsRead);

module.exports = router;
