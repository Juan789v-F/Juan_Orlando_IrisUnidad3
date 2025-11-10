const { pool } = require('../config/database');
const { searchVideos } = require('../services/youtubeService');

// Get all bosses (list view)
const getAllBosses = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, short_description, image_url FROM bosses ORDER BY id'
    );

    res.json({
      bosses: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get all bosses error:', error);
    res.status(500).json({ error: 'Failed to fetch bosses' });
  }
};

// Get boss by ID (detail view)
const getBossById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, short_description, lore, image_url, created_at FROM bosses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Boss not found' });
    }

    res.json({ boss: result.rows[0] });
  } catch (error) {
    console.error('Get boss by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch boss details' });
  }
};

// Get YouTube videos for a boss
const getBossVideos = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the boss name
    const result = await pool.query(
      'SELECT name FROM bosses WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Boss not found' });
    }

    const bossName = result.rows[0].name;
    
    // Search for videos with boss name and "Dark Souls"
    const query = `Dark Souls ${bossName}`;
    const videos = await searchVideos(query, 3);

    res.json({
      boss: bossName,
      videos: videos,
      count: videos.length
    });
  } catch (error) {
    console.error('Get boss videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

module.exports = {
  getAllBosses,
  getBossById,
  getBossVideos
};
