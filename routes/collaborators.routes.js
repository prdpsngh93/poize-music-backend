const express = require("express");
const router = express.Router();
const collaborator = require("../controllers/collaboratorController");
const authMiddleware = require("../middlewares/authMiddleware"); // assumes you have this middleware

router.use(authMiddleware);

router.get("/", collaborator.getAllCollaborators);
router.get("/:id", collaborator.getCollaboratorById);
router.put("/:id", collaborator.updateCollaborator);
router.delete("/:id", collaborator.deleteCollaborator);
router.get("/contributer-dashboard/:id" , collaborator.contributorDashboard)

module.exports = router;
