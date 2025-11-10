function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <div className="no-comments">No hay comentarios aún. ¡Sé el primero en compartir tus pensamientos!</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <span className="comment-author">⚔️ {comment.user_email}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
