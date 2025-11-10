import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function BossList() {
  const [bosses, setBosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBosses();
  }, []);

  const fetchBosses = async () => {
    try {
      const response = await api.get('/api/bosses');
      setBosses(response.data.bosses);
    } catch (err) {
      setError('Failed to load bosses');
      console.error('Error fetching bosses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando jefes...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="boss-list">
      <div className="boss-grid">
        {bosses.map((boss) => (
          <Link to={`/boss/${boss.id}`} key={boss.id} className="boss-card">
            <div className="boss-image-container">
              <img src={boss.image_url} alt={boss.name} className="boss-image" />
            </div>
            <div className="boss-info">
              <h3 className="boss-name">{boss.name}</h3>
              <p className="boss-description">{boss.short_description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BossList;
