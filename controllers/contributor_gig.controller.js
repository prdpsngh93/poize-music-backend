const { ContributorGig } = require('../models');

// Create a new gig
exports.createGig = async (req, res) => {
    try {
        const gig = await ContributorGig.create(req.body);
        res.status(201).json(gig);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all gigs
exports.getAllGigs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const offset = (page - 1) * limit;

        const gigs = await ContributorGig.findAndCountAll({
            where: {
                name: {
                    [require('sequelize').Op.iLike]: `%${search}%`,
                },
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
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
