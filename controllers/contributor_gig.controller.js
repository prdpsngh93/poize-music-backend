const { ContributorGig ,User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require("../models"); // adjust path to your models/index.js



exports.createGig = async (req, res) => {
    try {
        const gig = await ContributorGig.create(req.body);
        res.status(201).json(gig);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllGigs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', date, venue, status } = req.query; 
    const { contributorId } = req.params;
    const offset = (page - 1) * limit;

    // Build where clause dynamically
    const whereClause = {
      gig_title: {
        [Op.iLike]: `%${search}%`,
      },
    };

    // contributor filter
    if (contributorId) {
      whereClause.collaborator_id = contributorId;
    }

    // venue filter
    if (venue) {
      console.log("venue",venue)
      whereClause.venue_type = venue; // assuming your model has a 'venue' column
    }

    // status filter
    if (status) {
      whereClause.status = status; // assuming your model has a 'status' column
    }

    // date filter
    if (date) {
      const today = new Date();
      if (date === "Today") {
        whereClause.created_at = {
          [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
        };
      } else if (date === "This Week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        whereClause.created_at = {
          [Op.gte]: startOfWeek,
        };
      } else if (date === "This Month") {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        whereClause.created_at = {
          [Op.gte]: startOfMonth,
        };
      }
    }

    const gigs = await ContributorGig.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
    });

    const gigsWithArtist = await Promise.all(
      gigs.rows.map(async (gig) => {
        const artist = await User.findOne({
          where: { id: gig.musician_id },
          attributes: ["name"],
        });
        return { ...gig.toJSON(), artist };
      })
    );

    res.status(200).json({
      totalItems: gigs.count,
      totalPages: Math.ceil(gigs.count / limit),
      currentPage: parseInt(page),
      items: gigsWithArtist,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
exports.getLatestGigs = async (req, res) => {
  try {
    const gigs = await ContributorGig.findAll({
      where: { status: "active" }, // optional filter
      limit: 5,
      order: [["created_at", "DESC"]],
    });

    // attach artist details
    const gigsWithArtist = await Promise.all(
      gigs.map(async (gig) => {
        const artist = await User.findOne({
          where: { id: gig.musician_id },
          attributes: ["id", "name", "email"],
        });
        return { ...gig.toJSON(), artist };
      })
    );

    res.status(200).json({
      totalItems: gigsWithArtist.length,
      items: gigsWithArtist,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch latest gigs",
      message: error.message,
    });
  }
};

// Get a single gig by ID
exports.getGigById = async (req, res) => {
    try {
        const gig = await ContributorGig.findByPk(req.params.id);
        if (!gig) return res.status(404).json({ error: 'Gig not found' });
        res.status(200).json(gig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a gig
exports.updateGig = async (req, res) => {
    try {
        const [updated] = await ContributorGig.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) return res.status(404).json({ error: 'Gig not found' });

        const updatedGig = await ContributorGig.findByPk(req.params.id);
        res.status(200).json(updatedGig);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a gig
exports.deleteGig = async (req, res) => {
    try {
        const deleted = await ContributorGig.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) return res.status(404).json({ error: 'Gig not found' });

        res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
