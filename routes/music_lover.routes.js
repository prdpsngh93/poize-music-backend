const express = require('express');
const router = express.Router();
const controller = require('../controllers/musicLover.controller');

// router.post('/', controller.createMusicLover);
router.get('/', controller.getAllMusicLovers);
router.get('/:id', controller.getMusicLoverById);
router.put('/:id', controller.updateMusicLover);
router.delete('/:id', controller.deleteMusicLover);

module.exports = router;
