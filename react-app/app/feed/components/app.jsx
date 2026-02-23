import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const POSTS_PER_PAGE = 2; // Define POSTS_PER_PAGE at the top

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CommentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

/* ── Single Post Card ──────────────────────────────────────────────────────── */
const FeedCard = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [following, setFollowing] = useState(false);

  const handleLike = () => {
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLiked(!liked);
  };

  return (
    <article className="feed-card">
      <div className="feed-card-header">
        <div className="feed-card-user">
          <div className="feed-card-avatar" style={{ background: post.user.color }} aria-hidden="true">
            {post.user.avatar}
          </div>
          <div className="feed-card-user-info">
            <span className="feed-card-name">{post.user.name}</span>
            <span className="feed-card-meta">
              {post.user.role}
              <span className="feed-card-dot" aria-hidden="true">·</span>
              {post.timeAgo}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`feed-card-follow${following ? ' following' : ''}`}
          onClick={() => setFollowing(!following)}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      {post.title && <p className="feed-card-title">{post.title}</p>}
      <p className="feed-card-text">{post.text}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="feed-card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="feed-card-tag">{tag}</span>
          ))}
        </div>
      )}

      {post.image && (
        <img className="feed-card-image" src={post.image} alt={`Post by ${post.user.name}`} loading="lazy" />
      )}

      {post.attachment && (
        <div className="feed-card-attachment">
          <span className="feed-card-attachment-icon"><PaperclipIcon /></span>
          <div className="feed-card-attachment-info">
            <span className="feed-card-attachment-name">{post.attachment.name}</span>
            <span className="feed-card-attachment-type">{post.attachment.type}</span>
          </div>
        </div>
      )}

      <div className="feed-card-footer">
        <div className="feed-card-actions">
          <button
            type="button"
            className={`feed-action-btn${liked ? ' liked' : ''}`}
            onClick={handleLike}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <HeartIcon />
            <span>{likeCount}</span>
          </button>
          <button type="button" className="feed-action-btn" aria-label="Comment">
            <CommentIcon />
            <span>{post.comments}</span>
          </button>
        </div>
        <button
          type="button"
          className={`feed-action-btn feed-save-btn${saved ? ' saved' : ''}`}
          onClick={() => setSaved(!saved)}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <BookmarkIcon />
        </button>
      </div>
    </article>
  );
};

FeedCard.propTypes = {
  post: PropTypes.shape({
    liked: PropTypes.bool,
    likes: PropTypes.number,
    saved: PropTypes.bool,
    user: PropTypes.shape({
      color: PropTypes.string,
      avatar: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
    }),
    timeAgo: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    image: PropTypes.string,
    attachment: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
    comments: PropTypes.number,
  }).isRequired,
};

/* ── Feed with Lazy Loading ────────────────────────────────────────────────── */
const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const ctx = useRef({
    all: [],
    page: 1,
    busy: false,
    hasMore: false,
  });

  useEffect(() => {
    fetch('/mock.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load feed data (${res.status})`);
        return res.json();
      })
      .then((data) => {
        const initial = data.posts.slice(0, POSTS_PER_PAGE);
        const more = data.posts.length > POSTS_PER_PAGE;
        ctx.current = {
          all: data.posts,
          page: 1,
          busy: false,
          hasMore: more,
        };
        setAllPosts(data.posts);
        setVisiblePosts(initial);
        setHasMore(more);
        setInitialLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setInitialLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleNewPost = ({ detail }) => {
      const {
        title = '',
        text = '',
        images = [],
        attachments = [],
        links = [],
      } = detail;

      const mimeLabel = (mime) => (mime === 'video/mp4' ? 'MP4 · video' : 'PDF · document');

      let attachment = null;
      if (attachments.length > 0) {
        attachment = {
          name: attachments[0].name,
          type: mimeLabel(attachments[0].mimeType),
        };
      } else if (links.length > 0) {
        attachment = {
          name: links[0].replace(/^https?:\/\//, ''),
          type: 'Google Drive · link',
        };
      }

      const newPost = {
        id: Date.now(),
        user: {
          name: 'You',
          role: 'Member',
          avatar: 'U',
          color: '#0073e6',
        },
        timeAgo: 'Just now',
        title: title || null,
        text,
        tags: `${text} ${title}`.match(/#\w+/g) || [],
        image: images.length > 0 ? images[0].url : null,
        attachment,
        likes: 0,
        comments: 0,
        liked: false,
        saved: false,
      };

      setAllPosts((prev) => [newPost, ...prev]);
      setVisiblePosts((prev) => [newPost, ...prev]);
    };

    document.addEventListener('post-bar:submit', handleNewPost);
    return () => document.removeEventListener('post-bar:submit', handleNewPost);
  }, []);

  useEffect(() => {
    ctx.current = {
      all: allPosts,
      page,
      busy: loadingMore,
      hasMore,
    };
  }, [allPosts, page, loadingMore, hasMore]);

  useEffect(() => {
    if (initialLoading) return undefined;

    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const loadNext = () => {
      const {
        all,
        page: pg,
        busy,
        hasMore: more,
      } = ctx.current; // Properly formatted destructuring with line breaks
      if (busy || !more) return;

      ctx.current = { ...ctx.current, busy: true };
      setLoadingMore(true);

      setTimeout(() => {
        const nextPage = pg + 1;
        const nextVisible = all.slice(0, nextPage * POSTS_PER_PAGE);
        const stillMore = nextVisible.length < all.length;

        setVisiblePosts(nextVisible);
        setPage(nextPage);
        setHasMore(stillMore);
        setLoadingMore(false);
        ctx.current = {
          all,
          page: nextPage,
          busy: false,
          hasMore: stillMore,
        };
      }, 700);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadNext();
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [initialLoading]);

  if (initialLoading) return <div className="feed-status">Loading feed…</div>;
  if (error) return <div className="feed-status feed-status-error">{error}</div>;

  return (
    <div className="feed">
      {visiblePosts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}

      <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true">
        {loadingMore && <span className="feed-spinner" />}
        {!hasMore && !loadingMore && visiblePosts.length > 0 && (
          <p className="feed-end-message">{"You're all caught up!"}</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
