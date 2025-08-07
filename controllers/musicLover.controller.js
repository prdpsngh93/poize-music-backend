const { Op } = require('sequelize');
const { MusicLover, User } = require('../models');

exports.getAllMusicLovers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await MusicLover.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
          where: {
            name: {
              [Op.iLike]: `%${search}%`, // Case-insensitive search by user's name
            },
          },
          required: true, // Ensures MusicLovers must have a matching User
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      lovers: rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Get a MusicLover by ID
exports.getMusicLoverById = async (req, res) => {
  try {
    const lover = await MusicLover.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // include any other fields you need
        },
      ],
    });
    if (!lover) return res.status(404).json({ error: 'MusicLover not found' });
    return res.status(200).json(lover);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a MusicLover
exports.updateMusicLover = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, ...musicLoverFields } = req.body;

    // 1. Update User.name if provided
    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    // 2. Update MusicLover fields
    const [updated] = await MusicLover.update(musicLoverFields, {
      where: { user_id: userId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'MusicLover not found' });
    }

    // 3. Return updated MusicLover with User info
    const updatedLover = await MusicLover.findOne({
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.status(200).json(updatedLover);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update MusicLover', message: error.message });
  }
};


// Delete a MusicLover
exports.deleteMusicLover = async (req, res) => {
  try {
    const deleted = await MusicLover.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: 'MusicLover not found' });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
