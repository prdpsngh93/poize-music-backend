const express = require("express");
const router = express.Router();
const venueGigRequestController = require("../controllers/venue_gig_request.controller");

router.post("/", venueGigRequestController.createRequest);
router.get("/", venueGigRequestController.getAllRequests);
router.get("/:id", venueGigRequestController.getRequestById);
router.put("/:id", venueGigRequestController.updateRequest);
router.delete("/:id", venueGigRequestController.deleteRequest);
router.patch("/requests-status/:id", venueGigRequestController.updateRequestStatus);
router.get("/requests/:venueId", venueGigRequestController.getVenueRequest);
router.get("/get-by-gig/:gig_id", venueGigRequestController.getRequestsByGigId)

module.exports = router;