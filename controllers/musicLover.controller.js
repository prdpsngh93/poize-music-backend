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
    const lover = await MusicLover.findByPk(req.params.id);
    if (!lover) return res.status(404).json({ error: 'MusicLover not found' });
    return res.status(200).json(lover);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a MusicLover
exports.updateMusicLover = async (req, res) => {
  try {
    const [updated] = await MusicLover.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: 'MusicLover not found' });

    const updatedLover = await MusicLover.findByPk(req.params.id);
    return res.status(200).json(updatedLover);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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
