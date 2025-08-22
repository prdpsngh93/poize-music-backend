const express = require('express');
const router = express.Router();
const venueGigController = require('../controllers/venue_gigs.controller');

router.post('/', venueGigController.createGig);
router.get('/', venueGigController.getAllGigs);
router.get('/venue/:venueId', venueGigController.getAllGigs);
router.get('/:id', venueGigController.getGigById);
router.put('/:id', venueGigController.updateGig);
router.delete('/:id', venueGigController.deleteGig);
router.post('/status' , venueGigController.changeStatus)

module.exports = router;
