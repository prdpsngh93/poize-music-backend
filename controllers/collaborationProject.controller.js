const { CollaborationProject, User , Artist } = require('../models');

// Create a new project (requires authenticated user)
exports.createProject = async (req, res) => {
  try {
    const {
      project_title,
      project_description,
      genre,
      location,
      collaboration_format,
      media,
      contact_email,
      collaboration_expectations,
      visibility,
      artist_id
    } = req.body;

    const user_id = req.user.id; // Comes from auth middleware

    const newProject = await CollaborationProject.create({
      project_title,
      project_description,
      genre,
      location,
      collaboration_format,
      media,
      contact_email,
      collaboration_expectations,
      visibility,
      user_id,
      artist_id
    });

    const artist = await Artist.findByPk(artist_id);
    if (artist) {
      await artist.increment("collaboration_request_count", { by: 1 });
    }

    res.status(201).json({ message: 'Project created', data: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all projects (public)
exports.getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, artist_id } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (artist_id) {
      whereClause.artist_id = artist_id;
    }

    const { rows, count } = await CollaborationProject.findAndCountAll({
      where: whereClause,
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await CollaborationProject.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ data: project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a project (only if created by the user)
exports.updateProject = async (req, res) => {
  try {
    const project = await CollaborationProject.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only the creator can update
    if (project.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your project' });
    }

    await project.update(req.body);
    res.status(200).json({ message: 'Project updated', data: project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a project (only if created by the user)
exports.deleteProject = async (req, res) => {
  try {
    const project = await CollaborationProject.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your project' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
