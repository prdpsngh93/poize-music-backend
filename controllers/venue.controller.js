const { Venue } = require('../models');

// // Create a new venue
// exports.createVenue = async (req, res) => {
//   try {
//     const venue = await Venue.create(req.body);
//     return res.status(201).json(venue);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// Get all venues

exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    return res.status(200).json(venues);
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
