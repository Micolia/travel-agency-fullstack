import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import './community.css'

const Community = () => {
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [newDestination, setNewDestination] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { userData, token } = useContext(UserContext)

  // Cargar posts desde el backend
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/community')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      } else {
        console.error('Error fetching posts:', response.status)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault()
    if (!newPost.trim() || !token) return

    try {
      const response = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPost,
          destination: newDestination || null
        })
      })

      if (response.ok) {
        const newPostData = await response.json()
        setPosts([newPostData, ...posts])
        setNewPost('')
        setNewDestination('')
      } else {
        console.error('Error creating post:', response.status)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleLike = async (postId) => {
    if (!token) return

    try {
      const response = await fetch(`http://localhost:5000/api/community/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map(post =>
          post.id === postId
            ? { ...post, likes_count: updatedPost.likes_count }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Hoy'
    if (diffDays === 2) return 'Ayer'
    if (diffDays <= 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return <div className='community-container'>Cargando posts...</div>
  }

  return (
    <div className='community-container'>
      <div className='community-header'>
        <h1>🌐 Comunidad de Viajeros</h1>
        <p>Comparte tus experiencias de viaje y descubre nuevos destinos</p>
      </div>

      {/* Form new post */}
      {token && (
        <div className='post-form-container'>
          <form onSubmit={handlePostSubmit} className='post-form'>
            <input
              type='text'
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder='Destino (opcional)'
              className='post-destination-input'
            />
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder='Comparte tu experiencia de viaje...'
              rows={3}
              className='post-textarea'
              required
            />
            <button type='submit' className='post-submit-btn'>
              📤 Compartir
            </button>
          </form>
        </div>
      )}

      {!token && (
        <div className='login-prompt'>
          <p>Inicia sesión para compartir tus experiencias de viaje</p>
        </div>
      )}

      {/* Feed posts */}
      <div className='posts-feed'>
        {posts.length === 0
          ? (
            <div className='no-posts'>
              <p>No hay posts aún. ¡Sé el primero en compartir tu experiencia!</p>
            </div>
            )
          : (
              posts.map((post) => (
                <div key={post.id} className='post-card'>
                  <div className='post-header'>
                <div className='author-info'>
                  <div className='author-avatar'>
                    {post.user_name ? post.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className='author-details'>
                    <h4>{post.user_name || 'Usuario'}</h4>
                    <p className='post-meta'>
                      {post.destination && `📍 ${post.destination} • `}
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>

                  <div className='post-content'>
                <p>{post.content}</p>
                {post.images && (
                  <img src={post.images} alt='Post' className='post-image' />
                )}
              </div>

                  <div className='post-actions'>
                <button
                  className='action-btn like-btn'
                  onClick={() => handleLike(post.id)}
                  disabled={!token}
                >
                  ❤️ {post.likes_count || 0}
                </button>
                <button className='action-btn comment-btn' disabled>
                  💬 0
                </button>
                <button className='action-btn share-btn' disabled>
                  🔄 Compartir
                </button>
              </div>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

export default Community
