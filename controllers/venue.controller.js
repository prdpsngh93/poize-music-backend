const { Venue, User } = require('../models');
const { Op } = require('sequelize');


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


exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!venue) return res.status(404).json({ error: 'Venue not found' });
    return res.status(200).json(venue);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a venue
exports.updateVenue = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming it's user_id
    const { name, ...venueFields } = req.body;

    // 1. Update User name if provided
    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    // 2. Update Venue
    const [updated] = await Venue.update(venueFields, {
      where: { user_id: userId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // 3. Return updated venue with associated user info
    const updatedVenue = await Venue.findOne({
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.status(200).json(updatedVenue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update venue', message: error.message });
  }
};


// Delete a venue
exports.deleteVenue = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await Venue.destroy({
      where: { user_id: userId },
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Venue not found for this user' });
    }

    return res.status(204).send(); // No Content
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete venue', message: error.message });
  }
};

