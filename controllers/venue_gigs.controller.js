const { VenueGig } = require('../models');

// Create a new gig
exports.createGig = async (req, res) => {
  try {
    const gig = await VenueGig.create(req.body);
    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all gigs
exports.getAllGigs = async (req, res) => {
  try {
    const gigs = await VenueGig.findAll();
    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single gig by ID
exports.getGigById = async (req, res) => {
  try {
    const gig = await VenueGig.findByPk(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.status(200).json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a gig
exports.updateGig = async (req, res) => {
  try {
    const [updated] = await VenueGig.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ message: 'Gig not found' });

    const updatedGig = await VenueGig.findByPk(req.params.id);
    res.status(200).json(updatedGig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a gig
exports.deleteGig = async (req, res) => {
  try {
    const deleted = await VenueGig.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: 'Gig not found' });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
