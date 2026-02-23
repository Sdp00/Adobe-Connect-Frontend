import { useEffect, useState } from 'react';
import '../styles/index.css';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const USER_ID = 1;

  useEffect(() => {
    async function loadPosts() {
      try {
        // Fetch local mock json (EDS-style)
        const response = await fetch('db.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Filter posts by user
        const userPosts = data.posts.filter(
          (post) => post.userId === USER_ID,
        );

        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    }

    loadPosts();
  }, []);

  const handleRemove = (id) => {
    // UI-only removal (mock behavior)
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <section className="myposts-page">
      <h1 className="myposts-title">My Posts</h1>
      <p className="myposts-subtitle">
        Posts you have created recently
      </p>

      <div className="myposts-grid">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <img src={post.image} alt={post.title} />

            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.description}</p>

              <button
                className="remove-btn"
                onClick={() => handleRemove(post.id)}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="empty-state">No posts available</div>
        )}
      </div>
    </section>
  );
}
