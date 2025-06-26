const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/send-otp", auth.sendOTP);
router.post("/verify-otp", auth.verifyOTP);
router.post("/change-password", auth.changePassword); 
router.patch("/update-role", auth.updateUserRole);

module.exports = router;
