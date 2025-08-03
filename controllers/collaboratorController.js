const { Op } = require("sequelize");
const { Collaborator, User } = require("../models");

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

// 🔸 Get collaborator by ID
exports.getCollaboratorById = async (req, res) => {
  try {
    const collaborator = await Collaborator.findByPk(req.params.id);
    if (!collaborator) return res.status(404).json({ error: 'Collaborator not found' });
    res.json(collaborator);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collaborator', message: err.message });
  }
};

// 🔸 Update collaborator by ID
exports.updateCollaborator = async (req, res) => {
  try {
    const [updated] = await Collaborator.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ error: 'Collaborator not found' });

    const updatedCollaborator = await Collaborator.findByPk(req.params.id);
    res.json(updatedCollaborator);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update collaborator', message: err.message });
  }
};

// 🔸 Delete collaborator by ID
exports.deleteCollaborator = async (req, res) => {
  try {
    const deleted = await Collaborator.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Collaborator not found' });
    res.json({ message: 'Collaborator deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete collaborator', message: err.message });
  }
};
