const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/send-otp", auth.sendOTP);
router.post("/verify-otp", auth.verifyOTP); // ✅ new endpoint
router.post("/change-password", auth.changePassword); // ✅ new endpoint

module.exports = router;
