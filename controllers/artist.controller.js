const { User } = require("../models");

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await User.findAll({
      where: { role: 'artist' },
      attributes: { exclude: ['password'] }
    });

    res.json({ artists });
  } catch (err) {
    console.error("Error fetching artists:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
