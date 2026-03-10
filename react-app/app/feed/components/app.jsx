import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const POSTS_PER_PAGE = 2;

/* ── SVG Icon ──────────────────────────────────────────────────────────────── */
const SvgIcon = ({ name }) => {
  const [svgContent, setSvgContent] = useState('');
  useEffect(() => {
    fetch(`/icons/${name}.svg`)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(''));
  }, [name]);
  return <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgContent }} />;
};
SvgIcon.propTypes = { name: PropTypes.string.isRequired };

/* ── Image Carousel ────────────────────────────────────────────────────────── */
const ImageCarousel = ({ images, userName }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <img className="feed-card-image" src={images[0]} alt={`Post by ${userName}`} loading="lazy" />
    );
  }
  return (
    <div className="feed-card-carousel">
      <img
        className="feed-card-image"
        src={images[idx]}
        alt={`Image ${idx + 1} of ${images.length} by ${userName}`}
        loading="lazy"
      />
      <button
        type="button"
        className="feed-card-carousel-btn feed-card-carousel-prev"
        onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
        aria-label="Previous image"
      >&#8249;</button>
      <button
        type="button"
        className="feed-card-carousel-btn feed-card-carousel-next"
        onClick={() => setIdx((i) => (i + 1) % images.length)}
        aria-label="Next image"
      >&#8250;</button>
      <div className="feed-card-carousel-dots">
        {images.map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <button
            key={i}
            type="button"
            className={`feed-card-carousel-dot${i === idx ? ' is-active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  userName: PropTypes.string.isRequired,
};

/* ── Helper: strip hashtags from display text ──────────────────────────────── */
function stripHashtags(text) {
  if (!text) return '';
  return text.replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
}

/* ── Helper: format timeAgo ────────────────────────────────────────────────── */
function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Comments Section ──────────────────────────────────────────────────────── */
const CommentsSection = ({ postId, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [text, setText]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const tryFetch = () => {
      if (!window.SupabaseUtils?.client) {
        setTimeout(() => { if (!cancelled) tryFetch(); }, 200);
        return;
      }
      window.SupabaseUtils.client
        .from('comments')
        .select('comment_id, post_id, e_id, comment_text, created_at, employees(name)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .then(({ data, error: dbError }) => {
          if (cancelled) return;
          if (dbError) {
            console.error('Comments fetch error:', dbError.message);
            setFetchError(dbError.message);
            setLoading(false);
            return;
          }
          const all = data || [];
          setComments(all);
          onCountChange(all.length);
          setLoading(false);
        });
    };

    tryFetch();
    return () => { cancelled = true; };
  }, [postId, onCountChange]);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting || !window.SupabaseUtils?.client) return;
    setSubmitting(true);

    const { data, error: dbError } = await window.SupabaseUtils.client
      .from('comments')
      .insert({ post_id: postId, comment_text: trimmed })
      .select('comment_id, post_id, e_id, comment_text, created_at, employees(name)')
      .single();

    if (!dbError && data) {
      setComments((prev) => [...prev, data]);
      onCountChange(comments.length + 1);
      setText('');
    } else if (dbError) {
      console.error('Comment insert error:', dbError.message);
    }
    setSubmitting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="feed-comments">
      {loading && <p className="feed-comments-status">Loading comments…</p>}
      {fetchError && <p className="feed-comments-status" style={{ color: 'red' }}>{fetchError}</p>}

      {!loading && !fetchError && comments.length === 0 && (
        <p className="feed-comments-status">No comments yet. Be the first!</p>
      )}

      {comments.map((c) => (
        <div key={c.comment_id} className="feed-comment-item">
          <div className="feed-comment-avatar" aria-hidden="true">
            {c.employees?.name ? c.employees.name.slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="feed-comment-body">
            <span className="feed-comment-name">
              {c.employees?.name || 'You'}
            </span>
            <p className="feed-comment-text">{c.comment_text}</p>
            <span className="feed-comment-meta">{formatTimeAgo(c.created_at)}</span>
          </div>
        </div>
      ))}

      <div className="feed-comment-input-row">
        <div className="feed-comment-avatar" aria-hidden="true">U</div>
        <textarea
          className="feed-comment-input"
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="button"
          className="feed-comment-submit"
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          aria-label="Post comment"
        >
          {submitting ? '…' : 'Post'}
        </button>
      </div>
    </div>
  );
};

CommentsSection.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCountChange: PropTypes.func.isRequired,
};

/* ── Single Post Card ──────────────────────────────────────────────────────── */
const FeedCard = ({
  post, commentCount, isOpen, onToggle, onCommentCountChange,
}) => {
  const [liked, setLiked]         = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saved, setSaved]         = useState(post.saved);

  const handleLike = () => {
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLiked(!liked);
  };

  const handleCardClick = (e) => {
    if (!isOpen) return;
    if (e.target.closest('.feed-comments')) return;
    if (e.target.closest('.feed-action-btn')) return;
    onToggle();
  };

  return (
    <article className="feed-card" onClick={handleCardClick}>
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
      </div>

      {post.title && <p className="feed-card-title">{post.title}</p>}
      <p className="feed-card-text">{stripHashtags(post.text)}</p>

      {post.tags && post.tags.length > 0 && (
        <div className="feed-card-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="feed-card-tag">{tag}</span>
          ))}
        </div>
      )}

      <ImageCarousel images={post.images || []} userName={post.user.name} />

      {post.attachment && (
        <div className="feed-card-attachment">
          <span className="feed-card-attachment-icon"><SvgIcon name="paperclip" /></span>
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
            <SvgIcon name="heart" />
            <span>{likeCount}</span>
          </button>
          <button
            type="button"
            className={`feed-action-btn${isOpen ? ' active' : ''}`}
            aria-label={isOpen ? 'Hide comments' : 'Show comments'}
            onClick={onToggle}
          >
            <SvgIcon name="comment" />
            <span>{commentCount}</span>
          </button>
        </div>
        <button
          type="button"
          className={`feed-action-btn feed-save-btn${saved ? ' saved' : ''}`}
          onClick={() => setSaved(!saved)}
          aria-label={saved ? 'Unsave' : 'Save'}
        >
          <SvgIcon name="bookmark" />
        </button>
      </div>

      {isOpen && (
        <CommentsSection
          postId={post.id}
          onCountChange={onCommentCountChange}
        />
      )}
    </article>
  );
};

FeedCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    images: PropTypes.arrayOf(PropTypes.string),
    attachment: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
    comments: PropTypes.number,
  }).isRequired,
  commentCount: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onCommentCountChange: PropTypes.func.isRequired,
};

/* ── Helper: map Supabase row → FeedCard post shape ───────────────────────── */
function mapRowToPost(row) {
  return {
    id: row.post_id,
    user: {
      name: row.user_name || 'Unknown',
      role: row.user_role || 'Member',
      avatar: row.user_name?.slice(0, 2).toUpperCase() || '?',
      color: '#e11d48',
    },
    timeAgo: formatTimeAgo(row.created_at),
    title: null,
    text: stripHashtags(row.post_description || ''),
    tags: row.tags ? row.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    images: (() => {
      if (!row.media) return [];
      try { return JSON.parse(row.media); } catch { return [row.media]; }
    })(),
    attachment: null,
    likes: 0,
    comments: 0,
    liked: false,
    saved: false,
  };
}

/* ── Feed with Lazy Loading ────────────────────────────────────────────────── */
const Feed = () => {
  const [allPosts, setAllPosts]           = useState([]);
  const [visiblePosts, setVisiblePosts]   = useState([]);
  const [page, setPage]                   = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [hasMore, setHasMore]             = useState(false);
  const [error, setError]                 = useState(null);
  const [openPostId, setOpenPostId]       = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const sentinelRef = useRef(null);
  const ctx = useRef({ all: [], page: 1, busy: false, hasMore: false });

  /* ── Fetch posts + comment counts from Supabase ──────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    const tryFetch = () => {
      if (!window.SupabaseUtils?.client) {
        setTimeout(() => { if (!cancelled) tryFetch(); }, 200);
        return;
      }
      window.SupabaseUtils.client
        .from('posts')
        .select('*')
        .order('post_id', { ascending: false })
        .then(({ data, error: dbError }) => {
          if (cancelled) return;
          if (dbError) {
            setError(dbError.message);
            setInitialLoading(false);
            return;
          }
          const mapped  = (data || []).map(mapRowToPost);
          const initial = mapped.slice(0, POSTS_PER_PAGE);
          const more    = mapped.length > POSTS_PER_PAGE;
          ctx.current   = { all: mapped, page: 1, busy: false, hasMore: more };
          setAllPosts(mapped);
          setVisiblePosts(initial);
          setHasMore(more);
          setInitialLoading(false);

          /* fetch comment counts for all loaded posts */
          const postIds = mapped.map((p) => p.id);
          if (postIds.length > 0) {
            window.SupabaseUtils.client
              .from('comments')
              .select('post_id')
              .in('post_id', postIds)
              .then(({ data: cData }) => {
                if (cancelled) return;
                const counts = {};
                (cData || []).forEach((r) => {
                  counts[r.post_id] = (counts[r.post_id] || 0) + 1;
                });
                setCommentCounts(counts);
              });
          }
        });
    };

    tryFetch();
    return () => { cancelled = true; };
  }, []);

  /* ── Listen for new post events ─────────────────────────────────────────── */
  useEffect(() => {
    const handleNewPost = ({ detail }) => {
      const { title = '', text = '', images = [], attachments = [], links = [] } = detail;

      const mimeLabel = (mime) => (mime === 'video/mp4' ? 'MP4 · video' : 'PDF · document');
      let attachment = null;
      if (attachments.length > 0) {
        attachment = { name: attachments[0].name, type: mimeLabel(attachments[0].mimeType) };
      } else if (links.length > 0) {
        attachment = { name: links[0].replace(/^https?:\/\//, ''), type: 'Google Drive · link' };
      }

      const extractedTags = `${text} ${title}`.match(/#\w+/g) || [];
      const cleanText = stripHashtags(text);
      const newPost = {
        id: Date.now(),
        user: { name: 'You', role: 'Member', avatar: 'U', color: '#e11d48' },
        timeAgo: 'Just now',
        title: title || null,
        text: cleanText,
        tags: extractedTags,
        images: images.map((img) => img.url),
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
    ctx.current = { all: allPosts, page, busy: loadingMore, hasMore };
  }, [allPosts, page, loadingMore, hasMore]);

  /* ── Intersection observer for infinite scroll ───────────────────────────── */
  useEffect(() => {
    if (initialLoading) return undefined;
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const loadNext = () => {
      const { all, page: pg, busy, hasMore: more } = ctx.current;
      if (busy || !more) return;
      ctx.current = { ...ctx.current, busy: true };
      setLoadingMore(true);

      setTimeout(() => {
        const nextPage    = pg + 1;
        const nextVisible = all.slice(0, nextPage * POSTS_PER_PAGE);
        const stillMore   = nextVisible.length < all.length;
        setVisiblePosts(nextVisible);
        setPage(nextPage);
        setHasMore(stillMore);
        setLoadingMore(false);
        ctx.current = { all, page: nextPage, busy: false, hasMore: stillMore };
      }, 700);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadNext(); },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [initialLoading]);

  const handleCommentCountChange = (postId, count) => {
    setCommentCounts((prev) => ({ ...prev, [postId]: count }));
  };

  const handleToggle = (postId) => {
    setOpenPostId((prev) => (prev === postId ? null : postId));
  };

  if (initialLoading) return <div className="feed-status">Loading feed…</div>;
  if (error) return <div className="feed-status feed-status-error">{error}</div>;

  return (
    <div className="feed">
      {visiblePosts.map((post) => (
        <FeedCard
          key={post.id}
          post={post}
          commentCount={commentCounts[post.id] ?? post.comments}
          isOpen={openPostId === post.id}
          onToggle={() => handleToggle(post.id)}
          onCommentCountChange={(count) => handleCommentCountChange(post.id, count)}
        />
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