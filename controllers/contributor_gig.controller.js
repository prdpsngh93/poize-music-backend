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


// exports.getAllGigs = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '', date, venue, status, price } = req.query;
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
//       whereClause.venue_type = venue;
//     }

//     if (status) {
//       whereClause.status = status;
//     }

//     // 🎯 Price filter
//     if (price) {
//       if (price.toLowerCase() === "free") {
//         whereClause[Op.or] = [
//           { payment: 0 },
//           { payment: null }
//         ];
//       } else if (price.toLowerCase() === "paid") {
//         whereClause[Op.and] = [
//           { payment: { [Op.ne]: null } },
//           { payment: { [Op.ne]: 0 } }
//         ];
//       }
//     }
    
    

//     if (date) {
//       const today = new Date();

//       if (date === "1w") {
//         const oneWeekAgo = new Date();
//         oneWeekAgo.setDate(today.getDate() - 7);
//         whereClause.created_at = { [Op.gte]: oneWeekAgo };

//       } else if (date === "1m") {
//         const oneMonthAgo = new Date();
//         oneMonthAgo.setMonth(today.getMonth() - 1);
//         whereClause.created_at = { [Op.gte]: oneMonthAgo };

//       } else if (date === "3m") {
//         const threeMonthsAgo = new Date();
//         threeMonthsAgo.setMonth(today.getMonth() - 3);
//         whereClause.created_at = { [Op.gte]: threeMonthsAgo };
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

    // Search functionality
    const includeArray = [
      {
        model: User,
        as: 'musician',
        attributes: ["id", "name", "email"],
        required: false
      }
    ];

    // Build search conditions
    const searchConditions = [];
    
    if (search) {
      // Search in gig fields
      searchConditions.push(
        { gig_title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { genre: { [Op.iLike]: `%${search}%` } },
        { venue_type: { [Op.iLike]: `%${search}%` } }
      );

      // Add artist name search to include
      includeArray[0].where = { name: { [Op.iLike]: `%${search}%` } };
      includeArray[0].required = false; // Keep as left join for artist search
    }

    if (searchConditions.length > 0) {
      if (whereClause[Op.or]) {
        // If Op.or already exists (from price filter), merge conditions
        whereClause[Op.and] = [
          { [Op.or]: whereClause[Op.or] },
          { [Op.or]: searchConditions }
        ];
        delete whereClause[Op.or];
      } else {
        whereClause[Op.or] = searchConditions;
      }
    }

    // Sorting logic - Fixed!
    let orderClause;
    
    switch (sortBy) {
      case 'Price: Low to High': 
        // Handle null/0 values properly for price sorting
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
      case 'Default Sorting':
      default:
        orderClause = [['created_at', 'DESC']];
        break;
    }

    console.log('Applied filters:', { search, venue, status, price, startDate, endDate, sortBy });
    console.log('Where clause:', JSON.stringify(whereClause, null, 2));
    console.log('Order clause:', orderClause);

    const gigs = await ContributorGig.findAndCountAll({
      where: whereClause,
      include: includeArray,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause,
      distinct: true,
      subQuery: false // Important for proper counting with includes
    });

    const gigsWithArtist = gigs.rows.map(gig => ({
      ...gig.toJSON(),
      artist: gig.musician || null
    }));

    res.status(200).json({
      totalItems: gigs.count,
      totalPages: Math.ceil(gigs.count / limit),
      currentPage: parseInt(page),
      items: gigsWithArtist,
      appliedFilters: { 
        search, 
        venue, 
        status, 
        price, 
        startDate, 
        endDate, 
        sortBy,
        date 
      }
    });
  } catch (error) {
    console.error("Error in getAllGigs:", error);
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
