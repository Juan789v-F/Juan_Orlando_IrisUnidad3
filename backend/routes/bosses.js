const express = require('express');
const router = express.Router();
const { getAllBosses, getBossById, getBossVideos } = require('../controllers/bossController');

// GET /api/bosses - Get all bosses
router.get('/', getAllBosses);

// GET /api/bosses/:id/videos - Get YouTube videos for boss (must be before /:id)
router.get('/:id/videos', getBossVideos);

// GET /api/bosses/:id - Get boss by ID
router.get('/:id', getBossById);

module.exports = router;
