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

// exports.getAllGigs = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '', date, venue, status } = req.query; 
//     const { contributorId } = req.params;
//     const offset = (page - 1) * limit;

//     // Build where clause dynamically
//     const whereClause = {
//       gig_title: {
//         [Op.iLike]: `%${search}%`,
//       },
//     };

//     if (contributorId) {
//       whereClause.collaborator_id = contributorId;
//     }

//     if (venue) {
//       console.log("venue",venue)
//       whereClause.venue_type = venue; 
//     }

//     if (status) {
//       whereClause.status = status; 
//     }

//     // date filter
//     if (date) {
//       const today = new Date();
//       if (date === "Today") {
//         whereClause.created_at = {
//           [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
//         };
//       } else if (date === "This Week") {
//         const startOfWeek = new Date();
//         startOfWeek.setDate(today.getDate() - today.getDay());
//         startOfWeek.setHours(0, 0, 0, 0);

//         whereClause.created_at = {
//           [Op.gte]: startOfWeek,
//         };
//       } else if (date === "This Month") {
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//         whereClause.created_at = {
//           [Op.gte]: startOfMonth,
//         };
//       }
//     }

//     const gigs = await ContributorGig.findAndCountAll({
//       where: whereClause,
//       limit: parseInt(limit),
//       offset: parseInt(offset),
//       order: [["created_at", "DESC"]],
//     });

//     const gigsWithArtist = await Promise.all(
//       gigs.rows.map(async (gig) => {
//         const artist = await User.findOne({
//           where: { id: gig.musician_id },
//           attributes: ["name"],
//         });
//         return { ...gig.toJSON(), artist };
//       })
//     );

//     res.status(200).json({
//       totalItems: gigs.count,
//       totalPages: Math.ceil(gigs.count / limit),
//       currentPage: parseInt(page),
//       items: gigsWithArtist,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


exports.getAllGigs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', date, venue, status, price } = req.query;
    const { contributorId } = req.params;
    const offset = (page - 1) * limit;

    // Build where clause dynamically
    const whereClause = {
      gig_title: {
        [Op.iLike]: `%${search}%`,
      },
    };

    if (contributorId) {
      whereClause.collaborator_id = contributorId;
    }

    if (venue) {
      whereClause.venue_type = venue;
    }

    if (status) {
      whereClause.status = status;
    }

    // 🎯 Price filter
    if (price) {
      if (price.toLowerCase() === "free") {
        whereClause[Op.or] = [
          { payment: 0 },
          { payment: null }
        ];
      } else if (price.toLowerCase() === "paid") {
        whereClause[Op.and] = [
          { payment: { [Op.ne]: null } },
          { payment: { [Op.ne]: 0 } }
        ];
      }
    }
    
    

    if (date) {
      const today = new Date();

      if (date === "1w") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        whereClause.created_at = { [Op.gte]: oneWeekAgo };

      } else if (date === "1m") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);
        whereClause.created_at = { [Op.gte]: oneMonthAgo };

      } else if (date === "3m") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        whereClause.created_at = { [Op.gte]: threeMonthsAgo };
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
