// controllers/ContributorGigRequestController.js
const { ContributorGigRequest  ,  MusicLover, ContributorGig} = require("../models");

// CREATE request
exports.createRequest = async (req, res) => {
  try {
    const { music_lover_id, gig_id, payment_status ,  title,        
      description} = req.body;

    if (!music_lover_id || !gig_id) {
      return res.status(400).json({ error: "music_lover_id and gig_id are required" });
    }

    const request = await ContributorGigRequest.create({
      music_lover_id,
      gig_id,
      payment_status,
      title,        
      description,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, music_lover_id, collaborator_id } = req.query;
    const offset = (page - 1) * limit;

    // Build dynamic filter
    const whereClause = {};
    if (music_lover_id) {
      whereClause.music_lover_id = music_lover_id;
    }
    // Fetch requests
    const { rows, count } = await ContributorGigRequest.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    // Fetch related manually
    let data = await Promise.all(
      rows.map(async (reqItem) => {
        const musicLover = await MusicLover.findByPk(reqItem.music_lover_id, {
          attributes: ["id", "full_name"],
        });
        const gig = await ContributorGig.findByPk(reqItem.gig_id, {
          attributes: [
            "id",
            "gig_title",
            "date",
            "venue_type",
            "genre",
            "description",
            "musician_id",
            "collaborator_id",
            "payment",
            "attachment_url",
          ],
        });

        return {
          ...reqItem.toJSON(),
          musicLover: musicLover || null,
          gig: gig || null,
        };
      })
    );

    if (collaborator_id) {
      data = data.filter(
        (item) => item.gig && item.gig.collaborator_id === collaborator_id
      );
    }

    res.json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      data,
    });
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
