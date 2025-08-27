const { VenueGig, Artist, ContributorGig, VenueGigRequest,ContributorGigRequest } = require('../models');
const { Op } = require('sequelize');

// Create a new gig
exports.createGig = async (req, res) => {
  try {
    const gig = await VenueGig.create(req.body);
    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllGigs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', genre, dateFilter } = req.query;
    const { venueId } = req.params;
    const offset = (page - 1) * limit;

    const whereClause = {
      gig_title: {
        [Op.iLike]: `%${search}%`,
      },
    };

    // Filter by venue
    if (venueId) {
      whereClause.venue_id = venueId;
    }

    // Filter by genre
    if (genre) {
      whereClause.genre = genre;
    }

    // Filter by date range
    if (dateFilter) {
      let dateLimit;
      const now = new Date();

      if (dateFilter === '1w') {
        dateLimit = new Date(now.setDate(now.getDate() - 7));
      } else if (dateFilter === '1m') {
        dateLimit = new Date(now.setMonth(now.getMonth() - 1));
      } else if (dateFilter === '3m') {
        dateLimit = new Date(now.setMonth(now.getMonth() - 3));
      }

      if (dateLimit) {
        whereClause.date_time = {
          [Op.gte]: dateLimit,
        };
      }
    }

    const gigs = await VenueGig.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      totalItems: gigs.count,
      totalPages: Math.ceil(gigs.count / limit),
      currentPage: parseInt(page),
      items: gigs.rows,
    });
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


exports.changeStatus = async (req, res) => {
  try {
    const { artist_id, status, gig_id, performance_terms, payment_terms, cancellation_policy } = req.body;

    if (!artist_id || !status || !gig_id) {
      return res.status(400).json({ error: "artist_id, gig_id, and status are required" });
    }

    // Find gig
    const gig = await ContributorGig.findByPk(gig_id);
    if (!gig) {
      return res.status(404).json({ error: "Gig not found" });
    }

    // Update status of gig
    gig.status = status;
    await gig.save();

    const gigRequest = await ContributorGigRequest.findOne({
      where: {
        gig_id: gig_id, music_lover_id: artist_id   
      }
    });

    if (gigRequest) {
      gigRequest.performance_terms = performance_terms || gigRequest.performance_terms;
      gigRequest.payment_terms = payment_terms || gigRequest.payment_terms;
      gigRequest.cancellation_policy = cancellation_policy || gigRequest.cancellation_policy;
      await gigRequest.save();
    }

    // If completed, increment artist's gigs_completed count
    if (status.toLowerCase() === "completed") {
      const artist = await Artist.findByPk(artist_id);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }

      await artist.increment("gigs_completed", { by: 1 });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      gig,
    });
  } catch (error) {
    console.error("Error in changeStatus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getLatestGigAndRequest = async (req, res) => {
  try {
    const { venueId } = req.query; // optional filter

    // Build where clause
    const whereClause = {};
    if (venueId) {
      whereClause.venue_id = venueId;
    }

    // Fetch latest gig
    const latestGig = await VenueGig.findOne({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    // Fetch latest request
    let latestRequest = await VenueGigRequest.findOne({
      where: whereClause,
      order: [["created_at", "DESC"]],
    });

    // 👉 If latestRequest exists, fetch its gig to attach gig_image
    if (latestRequest) {
      const requestGig = await VenueGig.findByPk(latestRequest.gig_id, {
        attributes: ["gig_image"],
      });
      latestRequest = {
        ...latestRequest.toJSON(),
        gig_image: requestGig ? requestGig.gig_image : null,
      };
    }

    // Fetch all requests for the venue to get artist_ids
    const allRequests = await VenueGigRequest.findAll({
      where: whereClause,
      attributes: ["artist_id"],
    });

    // Get unique artist_ids
    const artistIds = [...new Set(allRequests.map((r) => r.artist_id))];

    // Fetch artist data
    const artists = await Artist.findAll({
      where: { id: artistIds },
    });

    // Count active gigs
    const activeGigsCount = await VenueGig.count({
      where: {
        ...whereClause,
        status: "active",
      },
    });

    // Count draft gigs
    const draftGigsCount = await VenueGig.count({
      where: {
        ...whereClause,
        status: "draft",
      },
    });

    // Count total requests
    const totalRequestsCount = await VenueGigRequest.count({
      where: whereClause,
    });

    res.status(200).json({
      latestGig: latestGig || null,
      latestRequest: latestRequest || null,
      activeGigsCount,
      draftGigsCount,
      totalRequestsCount,
      artists,
    });
  } catch (error) {
    console.error("Error fetching latest gig, request, and artists:", error);
    res.status(500).json({ error: error.message });
  }
};
