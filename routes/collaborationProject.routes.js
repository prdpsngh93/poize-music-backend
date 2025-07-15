const express = require("express");
const router = express.Router();
const collaborationController = require("../controllers/collaborationProject.controller");
const authMiddleware = require("../middlewares/authMiddleware"); // assumes you have this middleware

router.use(authMiddleware);

// ➕ Create project
router.post("/", collaborationController.createProject);

// 📄 Get all projects
router.get("/", collaborationController.getAllProjects);

// 🔍 Get single project by ID
router.get("/:id", collaborationController.getProjectById);

// ✏️ Update a project
router.put("/:id", collaborationController.updateProject);

// ❌ Delete a project
router.delete("/:id", collaborationController.deleteProject);

module.exports = router;
