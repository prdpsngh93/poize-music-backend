const express = require("express");
const router = express.Router();
const user = require("../controllers/user.controller");

router.get("/user-info", user.getUserInfo);
router.patch('/user-update', user.updateUser);

module.exports = router;
