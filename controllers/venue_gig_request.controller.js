
const { Op, fn, col } = require("sequelize");
const { VenueGigRequest , Artist , VenueGig} = require("../models");


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

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await VenueGigRequest.findAll();
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getVenueRequest = async (req, res) => {
  try {
    const { venueId } = req.params; // assuming you send /requests/:venueId
    const { page = 1, limit = 10, search = "" } = req.query;

    if (!venueId) {
      return res.status(400).json({ error: "venueId is required" });
    }

    const offset = (page - 1) * limit;

    // Apply filters
    const whereClause = {
      venue_id: venueId,
    };

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    // Fetch requests with count of artists per gig
    const { rows, count } = await VenueGigRequest.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "gig_id",
        "artist_id",
        "title",
        "message",
        "venue_id",
        "status",
        [fn("COUNT", col("gig_id")), "request_count"], // count per gig
      ],
      group: ["VenueGigRequest.id"], // group by id to avoid duplication
      order: [["created_at", "DESC"]],
      offset,
      limit: parseInt(limit),
    });

    return res.status(200).json({
      total: count.length || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rows,
    });
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

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const request = await VenueGigRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = status;
    await request.save();

    return res.status(200).json({ message: "Status updated successfully", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getRequestsByGigId = async (req, res) => {
  try {
    const { gig_id } = req.params;

    if (!gig_id) {
      return res.status(400).json({ error: "gig_id is required" });
    }

    // Step 1: Get all requests for this gig (exclude rejected)
    const requests = await VenueGigRequest.findAll({
      where: { 
        gig_id,
        status: { [Op.ne]: "reject" }
      },
    });

    if (!requests.length) {
      return res.status(404).json({ message: "No requests found for this gig" });
    }

    // Step 2: Fetch the gig details
    const gig = await VenueGig.findByPk(gig_id);

    // Step 3: Fetch all artist details (with user info)
    const artistIds = requests.map((req) => req.artist_id);
    const artists = await Artist.findAll({
      where: { id: artistIds },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"], // fetch artist's name & email
        },
      ],
    });

    // Step 4: Build response
    const data = requests.map((req) => {
      const artist = artists.find((a) => a.id === req.artist_id);
      return {
        ...req.toJSON(),
        artist: artist
          ? {
              id: artist.id,
              bio: artist.bio,
              profile_picture: artist.profile_picture,
              genre: artist.genre,
              gigs_completed: artist.gigs_completed,
              name: artist.User?.name || null, // 👈 artist name from User
              email: artist.User?.email || null,
            }
          : null,
      };
    });

    // Final response
    res.status(200).json({
      gig: gig || null,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
