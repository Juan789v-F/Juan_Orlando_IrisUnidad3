import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-icon">🔥</span>
            <span className="nav-logo-text">Wiki de Dark Souls</span>
          </Link>
          <div className="nav-menu">
            {user ? (
              <>
                <span className="nav-user">
                  <span className="nav-user-icon">⚔️</span>
                  {user.email}
                </span>
                <button onClick={handleLogout} className="nav-button nav-button-logout">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-button">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="nav-button nav-button-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🔥 Wiki de Dark Souls</h3>
            <p>Tu guía definitiva para los jefes legendarios de Lordran</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <Link to="/">Inicio</Link>
            <a href="https://darksouls.fandom.com" target="_blank" rel="noopener noreferrer">
              Wiki Oficial
            </a>
          </div>
          <div className="footer-section">
            <h4>Comunidad</h4>
            <p>Únete a nuestra comunidad de Hollow</p>
            <p className="footer-praise">☀️ Alaba al Sol ☀️</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Wiki de Dark Souls | Hecho con 🔥 para los Undead</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
