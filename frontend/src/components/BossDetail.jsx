import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

function BossDetail() {
  const { id } = useParams();
  const [boss, setBoss] = useState(null);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBossData();
  }, [id]);

  const fetchBossData = async () => {
    try {
      setLoading(true);
      
      // Fetch boss details
      const bossResponse = await api.get(`/api/bosses/${id}`);
      setBoss(bossResponse.data.boss);

      // Fetch videos
      const videosResponse = await api.get(`/api/bosses/${id}/videos`);
      setVideos(videosResponse.data.videos);

      // Fetch comments
      await fetchComments();

    } catch (err) {
      if (err.response?.status === 404) {
        setError('Boss not found');
      } else {
        setError('Failed to load boss details');
      }
      console.error('Error fetching boss data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsResponse = await api.get(`/api/comments/${id}`);
      setComments(commentsResponse.data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  if (loading) {
    return <div className="loading">Cargando detalles del jefe...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-button">← Volver a Jefes</Link>
      </div>
    );
  }

  if (!boss) {
    return null;
  }

  return (
    <div className="boss-detail">
      <Link to="/" className="back-button">← Volver a Jefes</Link>
      
      <div className="boss-header">
        <img src={boss.image_url} alt={boss.name} className="boss-detail-image" />
        <div className="boss-header-info">
          <h1>{boss.name}</h1>
          <p className="boss-short-desc">{boss.short_description}</p>
        </div>
      </div>

      <div className="boss-lore">
        <h2>Historia</h2>
        <p>{boss.lore}</p>
      </div>

      {videos.length > 0 && (
        <div className="boss-videos">
          <h2>Videos Relacionados</h2>
          <div className="video-grid">
            {videos.map((video) => (
              <a
                key={video.videoId}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card"
              >
                <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-channel">{video.channelTitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="boss-comments">
        <h2>Comentarios ({comments.length})</h2>
        <CommentForm bossId={id} onCommentAdded={fetchComments} />
        <CommentList comments={comments} />
      </div>
    </div>
  );
}

export default BossDetail;
