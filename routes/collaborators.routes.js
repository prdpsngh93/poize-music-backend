const express = require("express");
const router = express.Router();
const collaborator = require("../controllers/collaboratorController");
const authMiddleware = require("../middlewares/authMiddleware"); // assumes you have this middleware

router.use(authMiddleware);


// 📄 Get all projects
router.get("/", collaborator.getAllCollaborators);

// 🔍 Get single project by ID
router.get("/:id", collaborator.getCollaboratorById);

// ✏️ Update a project
router.put("/:id", collaborator.updateCollaborator);

// ❌ Delete a project
router.delete("/:id", collaborator.deleteCollaborator);

module.exports = router;
