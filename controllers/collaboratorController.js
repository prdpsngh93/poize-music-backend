const { Op } = require("sequelize");
const { Collaborator, User , ContributorGig } = require("../models");

exports.getAllCollaborators = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereUser = search
      ? { name: { [Op.iLike]: `%${search}%` } }
      : {};

    const { count, rows: collaborators } = await Collaborator.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
          where: whereUser
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: collaborators
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch collaborators',
      message: err.message
    });
  }
};

exports.getCollaboratorById = async (req, res) => {
  try {
    const collaborator = await Collaborator.findOne({
      where: { user_id: req.params.id },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // include any other fields you need
        },
      ],
    });

    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    res.json(collaborator);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collaborator', message: err.message });
  }
};

exports.updateCollaborator = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, ...collaboratorFields } = req.body;

    // 1. Update User.name if name is provided
    if (name) {
      await User.update({ name }, { where: { id: userId } });
    }

    // 2. Update Collaborator fields
    const [updated] = await Collaborator.update(collaboratorFields, {
      where: { user_id: userId },
    });

    if (!updated) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    // 3. Return updated result, including user info
    const updatedCollaborator = await Collaborator.findOne({
      where: { user_id: userId },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedCollaborator);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update collaborator', message: err.message });
  }
};

exports.deleteCollaborator = async (req, res) => {
  try {
    const deleted = await Collaborator.destroy({ where: { user_id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Collaborator not found' });
    res.json({ message: 'Collaborator deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete collaborator', message: err.message });
  }
};

exports.contributorDashboard = async (req, res) => {
  try {
    const {id: contributorId } = req.params;

    if (!contributorId) {
      return res.status(400).json({ error: "contributorId is required" });
    }

    const totalCount = await ContributorGig.count({
      where: { collaborator_id: contributorId }
    });

    // Count active gigs
    const activeCount = await ContributorGig.count({
      where: {
        collaborator_id: contributorId,
        status: 'active'
      }
    });

    // Count draft gigs
    const draftCount = await ContributorGig.count({
      where: {
        collaborator_id: contributorId,
        status: 'draft'
      }
    });

    const completedCount = await ContributorGig.count({
      where:{
        collaborator_id: contributorId,
        status: 'completed'
      }
    })

    res.status(200).json({
      collaborator_id: contributorId,
      active_gigs: activeCount,
      draft_gigs: draftCount,
      total_gigs: totalCount,
      completed_gigs: completedCount
    });
  } catch (error) {
    console.error("Error in venueDashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};