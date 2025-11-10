import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function CommentForm({ bossId, onCommentAdded }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="comment-form-login">
        <p>Por favor <Link to="/login">inicia sesión</Link> para dejar un comentario</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/comments', {
        boss_id: parseInt(bossId),
        content: content.trim()
      });

      setContent('');
      setSuccess(true);
      
      // Refresh comments list
      if (onCommentAdded) {
        onCommentAdded();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">¡Comentario publicado exitosamente!</div>}
      
      <div className="form-group">
        <label htmlFor="comment">Deja un Comentario</label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comparte tus pensamientos sobre este jefe..."
          rows="4"
          disabled={loading}
        />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Publicando...' : 'Publicar Comentario'}
      </button>
    </form>
  );
}

export default CommentForm;
