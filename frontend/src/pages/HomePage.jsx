import BossList from '../components/BossList';

function HomePage() {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-icon">🔥</div>
          <h1>Wiki de Jefes de Dark Souls</h1>
          <p className="hero-subtitle">Descubre la historia y secretos de los jefes más legendarios</p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">4</span>
              <span className="hero-stat-label">Jefes Legendarios</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">⚔️</span>
              <span className="hero-stat-label">Batallas Épicas</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">☀️</span>
              <span className="hero-stat-label">Alaba al Sol</span>
            </div>
          </div>
        </div>
      </div>

      <div className="boss-list-header">
        <h2>⚔️ Jefes Legendarios</h2>
        <p>Explora las historias de los enemigos más formidables de Lordran</p>
      </div>

      <BossList />
    </div>
  );
}

export default HomePage;
