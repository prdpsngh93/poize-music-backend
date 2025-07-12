const express = require("express");
const router = express.Router();
const artist = require("../controllers/artist.controller");

router.get("/artists", artist.getAllArtists);

module.exports = router;
