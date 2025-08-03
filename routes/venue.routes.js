const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');

// Read all
router.get('/', venueController.getAllVenues);

// Read one
router.get('/:id', venueController.getVenueById);

// Update
router.put('/:id', venueController.updateVenue);

// Delete
router.delete('/:id', venueController.deleteVenue);

module.exports = router;
