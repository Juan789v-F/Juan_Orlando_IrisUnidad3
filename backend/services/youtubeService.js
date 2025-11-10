const axios = require('axios');

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Search for YouTube videos related to a query
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results (default: 3)
 * @returns {Promise<Array>} Array of video objects
 */
const searchVideos = async (query, maxResults = 3) => {
  try {
    // Check if API key is configured
    if (!YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: maxResults,
        key: YOUTUBE_API_KEY
      },
      timeout: 5000 // 5 second timeout
    });

    // Transform response to simplified format
    const videos = response.data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));

    return videos;
  } catch (error) {
    // Log error but don't crash - return empty array
    if (error.response) {
      console.error('YouTube API error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('YouTube API timeout or network error');
    } else {
      console.error('YouTube API error:', error.message);
    }
    return [];
  }
};

module.exports = { searchVideos };
