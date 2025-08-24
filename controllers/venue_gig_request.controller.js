const { VenueGigRequest } = require("../models");


exports.createRequest = async (req, res) => {
  try {
    const { gig_id, artist_id, title, message, venue_id } = req.body;

    if (!gig_id || !artist_id || !title || !venue_id) {
      return res.status(400).json({ error: "gig_id, artist_id, title, and venue_id are required" });
    }

    const request = await VenueGigRequest.create({
      gig_id,
      artist_id,
      title,
      message,
      venue_id,
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await VenueGigRequest.findAll();
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await VenueGigRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { gig_id, artist_id, title, message, venue_id } = req.body;

    const request = await VenueGigRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await request.update({ gig_id, artist_id, title, message, venue_id });

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await VenueGigRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await request.destroy();
    return res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

