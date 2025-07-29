const { User } = require("../models");
const { Collaborator } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    console.log("user", user)
    res.status(201).json({ user , status:"success" });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({ error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const { password: _, ...userData } = user.toJSON();
  res.json({
    token,     // send token here
    user: userData,
  });
};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  await user.update({ otp, otp_expiry: expiry });

  await sendMail(email, "Your OTP", `Your OTP is ${otp}`);
  res.json({ message: "OTP sent to email" });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || user.otp !== otp || new Date() > user.otp_expiry) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // Optional: Clear OTP right after verification
  await user.update({ otp: null, otp_expiry: null });

  // Create temporary token valid for 10 minutes to allow password reset
  const tempToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  res.json({ message: "OTP verified", token: tempToken });
};

exports.changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

exports.updateUserRole = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { newRole } = req.body;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ role: newRole });


    if (newRole === "collaborator") {
      const existing = await Collaborator.findOne({ where: { user_id: user.id } });
      if (!existing) {
        await Collaborator.create({
          user_id: user.id,
          project_id: null,
          status: "pending",
          skill_tags: [],
          social_media_link: null,
          work_sample: null,
          short_bio: null,
          profile_picture: null,
          location: null
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "User role updated successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message || err.toString() });
  }
};