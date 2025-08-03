const { MusicLover } = require('../models');

// Create a new MusicLover
// exports.createMusicLover = async (req, res) => {
//   try {
//     const musicLover = await MusicLover.create(req.body);
//     return res.status(201).json(musicLover);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

// Get all MusicLovers
exports.getAllMusicLovers = async (req, res) => {
  try {
    const lovers = await MusicLover.findAll();
    return res.status(200).json(lovers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a MusicLover by ID
exports.getMusicLoverById = async (req, res) => {
  try {
    const lover = await MusicLover.findByPk(req.params.id);
    if (!lover) return res.status(404).json({ error: 'MusicLover not found' });
    return res.status(200).json(lover);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a MusicLover
exports.updateMusicLover = async (req, res) => {
  try {
    const [updated] = await MusicLover.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: 'MusicLover not found' });

    const updatedLover = await MusicLover.findByPk(req.params.id);
    return res.status(200).json(updatedLover);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a MusicLover
exports.deleteMusicLover = async (req, res) => {
  try {
    const deleted = await MusicLover.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ error: 'MusicLover not found' });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
