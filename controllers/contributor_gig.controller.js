const { ContributorGig, User } = require('../models');
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
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      date, 
      venue, 
      status, 
      price,
      startDate,
      endDate,
      sortBy = 'Default Sorting'
    } = req.query;
    
    const { contributorId } = req.params;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (contributorId) {
      whereClause.collaborator_id = contributorId;
    }

    if (venue) {
      whereClause.venue_type = { [Op.iLike]: `%${venue}%` };
    }

    if (status) {
      whereClause.status = status;
    }

    if (price) {
      if (price.toLowerCase() === "free") {
        whereClause[Op.or] = [
          { payment: "0.00" },
          { payment: null },
          { payment: 0 }
        ];
      } else if (price.toLowerCase() === "paid") {
        whereClause[Op.and] = [
          { payment: { [Op.ne]: null } },
          { payment: { [Op.ne]: "0.00" } },
          { payment: { [Op.ne]: 0 } }
        ];
      }
    }

    // Date range filters
    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
      whereClause.date = { [Op.gte]: startDate };
    } else if (endDate) {
      whereClause.date = { [Op.lte]: endDate };
    }

    // Relative date filters
    if (date) {
      const today = new Date();
      let fromDate;

      if (date === "1w") {
        fromDate = new Date();
        fromDate.setDate(today.getDate() - 7);
      } else if (date === "1m") {
        fromDate = new Date();
        fromDate.setMonth(today.getMonth() - 1);
      } else if (date === "3m") {
        fromDate = new Date();
        fromDate.setMonth(today.getMonth() - 3);
      }

      if (fromDate) {
        whereClause.created_at = { [Op.gte]: fromDate };
      }
    }

    // Build search conditions
    const searchConditions = [];
    
    if (search) {
      searchConditions.push(
        { gig_title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { genre: { [Op.iLike]: `%${search}%` } },
        { venue_type: { [Op.iLike]: `%${search}%` } }
      );
    }

    if (searchConditions.length > 0) {
      if (whereClause[Op.or]) {
        whereClause[Op.and] = [
          { [Op.or]: whereClause[Op.or] },
          { [Op.or]: searchConditions }
        ];
        delete whereClause[Op.or];
      } else {
        whereClause[Op.or] = searchConditions;
      }
    }

    // Sorting
    let orderClause;
    switch (sortBy) {
      case 'Price: Low to High': 
        orderClause = [
          [sequelize.literal('CASE WHEN payment IS NULL OR payment = 0 THEN 0 ELSE CAST(payment AS DECIMAL) END'), 'ASC']
        ]; 
        break;
      case 'Price: High to Low': 
        orderClause = [
          [sequelize.literal('CASE WHEN payment IS NULL OR payment = 0 THEN 0 ELSE CAST(payment AS DECIMAL) END'), 'DESC']
        ]; 
        break;
      case 'Newest First': 
        orderClause = [['created_at', 'DESC']]; 
        break;
      case 'Oldest First': 
        orderClause = [['created_at', 'ASC']]; 
        break;
      case 'Title A-Z': 
        orderClause = [['gig_title', 'ASC']]; 
        break;
      case 'Title Z-A': 
        orderClause = [['gig_title', 'DESC']]; 
        break;
      default:
        orderClause = [['created_at', 'DESC']];
        break;
    }

    // 1️⃣ Fetch gigs
    const gigs = await ContributorGig.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
      distinct: true
    });

    let gigsWithArtist = gigs.rows.map(gig => gig.toJSON());

    // 2️⃣ Collect all unique musician_ids from gigs
    const musicianIds = gigsWithArtist
      .map(g => g.musician_id)
      .filter(id => id); // remove null/undefined

    let users = [];
    if (musicianIds.length > 0) {
      users = await User.findAll({
        where: { id: { [Op.in]: musicianIds } },
        attributes: ["id", "name", "email"]
      });
    }

    // 3️⃣ Create a lookup map of users
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user.toJSON();
    });

    // 4️⃣ Attach artist manually to each gig
    gigsWithArtist = gigsWithArtist.map(gig => ({
      ...gig,
      artist: gig.musician_id ? userMap[gig.musician_id] || null : null
    }));

    res.status(200).json({
      totalItems: gigs.count,
      totalPages: Math.ceil(gigs.count / limit),
      currentPage: parseInt(page),
      items: gigsWithArtist,
      appliedFilters: { search, venue, status, price, startDate, endDate, sortBy, date }
    });
  } catch (error) {
    console.error("Error in getAllGigs:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getLatestGigs = async (req, res) => {
  try {
    const { id } = req.query; // contributor id from query param

    if (!id) {
      return res.status(400).json({ error: "Contributor id is required" });
    }

    const gigs = await ContributorGig.findAll({
      where: {
        status: "active",
        contributor_id: id, // filter gigs by contributor
      },
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
    console.error("Error fetching latest gigs:", error);
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
