// controllers/ContributorGigRequestController.js
const { ContributorGigRequest } = require("../models");

// CREATE request
exports.createRequest = async (req, res) => {
  try {
    const { music_lover_id, gig_id, payment_status } = req.body;

    if (!music_lover_id || !gig_id) {
      return res.status(400).json({ error: "music_lover_id and gig_id are required" });
    }

    const request = await ContributorGigRequest.create({
      music_lover_id,
      gig_id,
      payment_status,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ContributorGigRequest.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ single request
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContributorGigRequest.findByPk(id);

    if (!request) return res.status(404).json({ error: "Request not found" });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { music_lover_id, gig_id, payment_status } = req.body;

    const request = await ContributorGigRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    await request.update({ music_lover_id, gig_id, payment_status });

    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContributorGigRequest.findByPk(id);

    if (!request) return res.status(404).json({ error: "Request not found" });

    await request.destroy();
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
