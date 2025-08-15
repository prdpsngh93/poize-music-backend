const { User, Artist, Venue, Collaborator, MusicLover } = require("../models");
const jwt = require("jsonwebtoken");

exports.getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    let profile = null;
    switch (user.role) {
      case 'venue':
        profile = await Venue.findOne({ where: { user_id: user.id } });
        break;
      case 'artist':
        profile = await Artist.findOne({ where: { user_id: user.id } });
        break;
      case 'MusicLover':
        profile = await MusicLover.findOne({ where: { user_id: user.id } });
        break;
      case 'contributor':
        profile = await Collaborator.findOne({ where: { user_id: user.id } });
        break;
    }

    const { password, ...userData } = user.toJSON(); // Remove password
    res.json({ user: userData  , profile});
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
