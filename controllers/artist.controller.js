const { Artist , User } = require('../models');
const { Op } = require("sequelize");


exports.getAllArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const location = req.query.location || '';

    const offset = (page - 1) * limit;

    const whereUser = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};

    const whereArtist = {};
    if (genre) {
      whereArtist.genre = { [Op.iLike]: `%${genre}%` };
    }
    if (location) {
      whereArtist.location = { [Op.iLike]: `%${location}%` };
    }

    const { rows: artists, count: total } = await Artist.findAndCountAll({
      where: whereArtist,
      include: [
        {
          model: User,
          where: whereUser,
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      data: artists,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // include any other fields you need
        },
      ],
    });

    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, ...artistFields } = req.body;

    // 1. Update User.name if provided
    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    // 2. Update Artist fields
    const [updated] = await Artist.update(artistFields, {
      where: { user_id: userId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // 3. Return updated Artist with User info
    const updatedArtist = await Artist.findOne({
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedArtist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update artist', message: err.message });
  }
};

// 🔹 Delete Artist
exports.deleteArtist = async (req, res) => {
  try {
    const deleted = await Artist.destroy({
      where: { user_id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: 'Artist not found' });

    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
