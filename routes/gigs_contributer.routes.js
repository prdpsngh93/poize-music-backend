const express = require('express');
const router = express.Router();
const contributorGigController = require('../controllers/contributor_gig.controller');

// Get all gigs with search & pagination
router.get('/', contributorGigController.getAllGigs);
router.get('/contributor/:contributorId', contributorGigController.getAllGigs); 
router.get('/latest-gigs',contributorGigController.getLatestGigs)

// Get a single gig by ID
router.get('/:id', contributorGigController.getGigById);

// Create a new gig
router.post('/', contributorGigController.createGig);

// Update a gig by ID
router.put('/:id', contributorGigController.updateGig);

// Delete a gig by ID
router.delete('/:id', contributorGigController.deleteGig);

module.exports = router;
