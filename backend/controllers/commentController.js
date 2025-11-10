const { pool } = require('../config/database');

// Get all comments for a specific boss
const getCommentsByBoss = async (req, res) => {
  try {
    const { boss_id } = req.params;

    const result = await pool.query(
      `SELECT 
        comments.id,
        comments.boss_id,
        comments.user_id,
        comments.content,
        comments.created_at,
        users.email as user_email
      FROM comments
      INNER JOIN users ON comments.user_id = users.id
      WHERE comments.boss_id = $1
      ORDER BY comments.created_at DESC`,
      [boss_id]
    );

    res.json({
      comments: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Create a new comment (protected route)
const createComment = async (req, res) => {
  try {
    const { boss_id, content } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate input
    if (!boss_id || !content) {
      return res.status(400).json({ error: 'Boss ID and content are required' });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    // Verify boss exists
    const bossCheck = await pool.query(
      'SELECT id FROM bosses WHERE id = $1',
      [boss_id]
    );

    if (bossCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Boss not found' });
    }

    // Insert comment
    const result = await pool.query(
      `INSERT INTO comments (boss_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, boss_id, user_id, content, created_at`,
      [boss_id, userId, content.trim()]
    );

    const comment = result.rows[0];

    // Get user email for response
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        ...comment,
        user_email: userResult.rows[0].email
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

module.exports = {
  getCommentsByBoss,
  createComment
};
