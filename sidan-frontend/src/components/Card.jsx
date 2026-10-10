import { useState } from 'react'

/**
 * Componente <Card /> reutilizable
 * Recibe props: titulo, descripcion, imagen, categoria
 * Implementa interactividad con useState (sistema de Likes)
 */
function Card({ titulo, descripcion, imagen, categoria = 'info' }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1)
      setLiked(false)
    } else {
      setLikes(likes + 1)
      setLiked(true)
    }
  }

  return (
    <div className="card">
      {imagen && (
        <img
          src={imagen}
          alt={titulo}
          className="card-image"
        />
      )}
      <span className={`category-pill ${categoria}`}>
        {categoria}
      </span>
      <h3 className="card-title">{titulo}</h3>
      <p className="card-description">{descripcion}</p>
      <div className="card-footer">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          title={liked ? 'Quitar like' : 'Dar like'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{likes}</span>
        </button>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {liked ? '¡Te gusta!' : 'Toca para reaccionar'}
        </span>
      </div>
    </div>
  )
}

export default Card
