const { Venue, User } = require('../models');
const { Op } = require('sequelize');

// 🔸 Get all venues with pagination and search (including User.name)
exports.getAllVenues = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Venue.findAndCountAll({
      where: {
        [Op.or]: [
          { venue_name: { [Op.iLike]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name'],
          where: {
            name: { [Op.iLike]: `%${search}%` }, // Search in User name
          },
          required: false, // Keep this false to avoid filtering out venues without matching user
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      venues: rows,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a single venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    return res.status(200).json(venue);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a venue
exports.updateVenue = async (req, res) => {
  try {
    const [updated] = await Venue.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ error: 'Venue not found' });

    const updatedVenue = await Venue.findByPk(req.params.id);
    return res.status(200).json(updatedVenue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a venue
exports.deleteVenue = async (req, res) => {
  try {
    const deleted = await Venue.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: 'Venue not found' });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
