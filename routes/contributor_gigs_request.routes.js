// routes/contributorGigsRequestRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/contributor_gigs_request.controller");

router.post("/", controller.createRequest);
router.get("/", controller.getAllRequests);
router.get("/:id", controller.getRequestById);
router.put("/:id", controller.updateRequest);
router.delete("/:id", controller.deleteRequest);

module.exports = router;
