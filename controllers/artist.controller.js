const { Artist } = require('../models');

// 🔹 Create Artist
// exports.createArtist = async (req, res) => {
//   try {
//     const artist = await Artist.create(req.body);
//     res.status(201).json(artist);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// 🔹 Get All Artists
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Single Artist by ID
exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findByPk(req.params.id);
    if (!artist) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Update Artist
exports.updateArtist = async (req, res) => {
  try {
    const [updated] = await Artist.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ error: 'Artist not found' });

    const updatedArtist = await Artist.findByPk(req.params.id);
    res.json(updatedArtist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🔹 Delete Artist
exports.deleteArtist = async (req, res) => {
  try {
    const deleted = await Artist.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ error: 'Artist not found' });

    res.json({ message: 'Artist deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
