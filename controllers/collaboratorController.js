const { Collaborator } = require('../models');


// 🔸 Get all collaborators
exports.getAllCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.json(collaborators);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collaborators', message: err.message });
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
