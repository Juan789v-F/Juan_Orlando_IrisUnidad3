const express = require('express');
const router = express.Router();
const { getCommentsByBoss, createComment } = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

// GET /api/comments/:boss_id - Get all comments for a boss
router.get('/:boss_id', getCommentsByBoss);

// POST /api/comments - Create a new comment (protected)
router.post('/', authMiddleware, createComment);

module.exports = router;
