/******/ var __webpack_modules__ = ({

/***/ "./react-app/app/feed/components/app.jsx":
/*!***********************************************!*\
  !*** ./react-app/app/feed/components/app.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");



const POSTS_PER_PAGE = 2;

/* ── SVG Icon — fetches from /icons/{name}.svg and renders inline ──────────── */
const SvgIcon = ({
  name
}) => {
  const [svgContent, setSvgContent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(`/icons/${name}.svg`).then(res => res.text()).then(text => setSvgContent(text)).catch(() => setSvgContent(''));
  }, [name]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: svgContent
    }
  });
};
SvgIcon.propTypes = {
  name: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string).isRequired
};

/* ── Image Carousel ────────────────────────────────────────────────────────── */
const ImageCarousel = ({
  images,
  userName
}) => {
  const [idx, setIdx] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
      className: "feed-card-image",
      src: images[0],
      alt: `Post by ${userName}`,
      loading: "lazy"
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "feed-card-carousel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("img", {
      className: "feed-card-image",
      src: images[idx],
      alt: `Image ${idx + 1} of ${images.length} by ${userName}`,
      loading: "lazy"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      type: "button",
      className: "feed-card-carousel-btn feed-card-carousel-prev",
      onClick: () => setIdx(i => (i - 1 + images.length) % images.length),
      "aria-label": "Previous image",
      children: "\u2039"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
      type: "button",
      className: "feed-card-carousel-btn feed-card-carousel-next",
      onClick: () => setIdx(i => (i + 1) % images.length),
      "aria-label": "Next image",
      children: "\u203A"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "feed-card-carousel-dots",
      children: images.map((_, i) =>
      /*#__PURE__*/
      // eslint-disable-next-line react/no-array-index-key
      (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: `feed-card-carousel-dot${i === idx ? ' is-active' : ''}`,
        onClick: () => setIdx(i),
        "aria-label": `Image ${i + 1}`
      }, i))
    })]
  });
};
ImageCarousel.propTypes = {
  images: prop_types__WEBPACK_IMPORTED_MODULE_2___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)).isRequired,
  userName: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string).isRequired
};

/* ── Comments Section ───────────────────────────────────────────────────────── */
const CommentsSection = ({
  postId,
  onCountChange
}) => {
  const [comments, setComments] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [text, setText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [submitting, setSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!window.SupabaseUtils) {
      setLoading(false);
      return;
    }
    window.SupabaseUtils.client.from('comments').select('*').eq('post_id', postId).order('created_at', {
      ascending: true
    }).then(({
      data,
      error: dbError
    }) => {
      if (!dbError) {
        setComments(data || []);
        onCountChange((data || []).length);
      }
      setLoading(false);
    });
  }, [postId, onCountChange]);
  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting || !window.SupabaseUtils) return;
    setSubmitting(true);
    const {
      data,
      error: dbError
    } = await window.SupabaseUtils.client.from('comments').insert({
      post_id: postId,
      user_name: 'You',
      comment_text: trimmed
    }).select().single();
    if (!dbError && data) {
      setComments(prev => {
        const updated = [...prev, data];
        onCountChange(updated.length);
        return updated;
      });
      setText('');
    }
    setSubmitting(false);
  };
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "feed-comments",
    children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "feed-comments-status",
      children: "Loading comments\u2026"
    }), !loading && comments.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "feed-comments-status",
      children: "No comments yet. Be the first!"
    }), comments.map(c => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "feed-comment-item",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "feed-comment-avatar",
        "aria-hidden": "true",
        children: (c.user_name || 'U').slice(0, 1).toUpperCase()
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "feed-comment-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "feed-comment-name",
          children: c.user_name || 'Unknown'
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
          className: "feed-comment-text",
          children: c.comment_text
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "feed-comment-meta",
          children: formatTimeAgo(c.created_at)
        })]
      })]
    }, c.comment_id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "feed-comment-input-row",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "feed-comment-avatar",
        "aria-hidden": "true",
        children: "U"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("textarea", {
        className: "feed-comment-input",
        placeholder: "Write a comment\u2026",
        value: text,
        onChange: e => setText(e.target.value),
        onKeyDown: handleKeyDown,
        rows: 1
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: "feed-comment-submit",
        onClick: handleSubmit,
        disabled: !text.trim() || submitting,
        "aria-label": "Post comment",
        children: submitting ? '…' : 'Post'
      })]
    })]
  });
};
CommentsSection.propTypes = {
  postId: prop_types__WEBPACK_IMPORTED_MODULE_2___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_2___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number)]).isRequired,
  onCountChange: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func).isRequired
};

/* ── Single Post Card ──────────────────────────────────────────────────────── */
const FeedCard = ({
  post
}) => {
  const [liked, setLiked] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(post.liked);
  const [likeCount, setLikeCount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(post.likes);
  const [saved, setSaved] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(post.saved);
  const [showComments, setShowComments] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [commentCount, setCommentCount] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(post.comments);
  const handleLike = () => {
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLiked(!liked);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("article", {
    className: "feed-card",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "feed-card-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "feed-card-user",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "feed-card-avatar",
          style: {
            background: post.user.color
          },
          "aria-hidden": "true",
          children: post.user.avatar
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "feed-card-user-info",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "feed-card-name",
            children: post.user.name
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("span", {
            className: "feed-card-meta",
            children: [post.user.role, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
              className: "feed-card-dot",
              "aria-hidden": "true",
              children: "\xB7"
            }), post.timeAgo]
          })]
        })]
      })
    }), post.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "feed-card-title",
      children: post.title
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "feed-card-text",
      children: post.text
    }), post.tags && post.tags.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "feed-card-tags",
      children: post.tags.map(tag => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "feed-card-tag",
        children: tag
      }, tag))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(ImageCarousel, {
      images: post.images || [],
      userName: post.user.name
    }), post.attachment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "feed-card-attachment",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "feed-card-attachment-icon",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SvgIcon, {
          name: "paperclip"
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "feed-card-attachment-info",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "feed-card-attachment-name",
          children: post.attachment.name
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
          className: "feed-card-attachment-type",
          children: post.attachment.type
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "feed-card-footer",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "feed-card-actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          className: `feed-action-btn${liked ? ' liked' : ''}`,
          onClick: handleLike,
          "aria-label": liked ? 'Unlike' : 'Like',
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SvgIcon, {
            name: "heart"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            children: likeCount
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("button", {
          type: "button",
          className: `feed-action-btn${showComments ? ' active' : ''}`,
          "aria-label": showComments ? 'Hide comments' : 'Show comments',
          onClick: () => setShowComments(v => !v),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SvgIcon, {
            name: "comment"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            children: commentCount
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
        type: "button",
        className: `feed-action-btn feed-save-btn${saved ? ' saved' : ''}`,
        onClick: () => setSaved(!saved),
        "aria-label": saved ? 'Unsave' : 'Save',
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(SvgIcon, {
          name: "bookmark"
        })
      })]
    }), showComments && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(CommentsSection, {
      postId: post.id,
      onCountChange: setCommentCount
    })]
  });
};
FeedCard.propTypes = {
  post: prop_types__WEBPACK_IMPORTED_MODULE_2___default().shape({
    id: prop_types__WEBPACK_IMPORTED_MODULE_2___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_2___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number)]),
    liked: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    likes: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
    saved: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    user: prop_types__WEBPACK_IMPORTED_MODULE_2___default().shape({
      color: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
      avatar: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
      name: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
      role: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)
    }),
    timeAgo: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    title: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    text: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    tags: prop_types__WEBPACK_IMPORTED_MODULE_2___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)),
    images: prop_types__WEBPACK_IMPORTED_MODULE_2___default().arrayOf((prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)),
    attachment: prop_types__WEBPACK_IMPORTED_MODULE_2___default().shape({
      name: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
      type: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string)
    }),
    comments: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number)
  }).isRequired
};

/* ── Helper: format timeAgo from ISO timestamp ─────────────────────────────── */
function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Helper: map Supabase row → FeedCard post shape ───────────────────────── */
function mapRowToPost(row) {
  return {
    id: row.post_id,
    user: {
      name: row.user_name || 'Unknown',
      role: row.user_role || 'Member',
      avatar: row.user_name?.slice(0, 2).toUpperCase() || '?',
      color: '#0073e6'
    },
    timeAgo: formatTimeAgo(row.created_at),
    title: null,
    text: row.post_description || '',
    tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    images: (() => {
      if (!row.media) return [];
      try {
        return JSON.parse(row.media);
      } catch {
        return [row.media];
      }
    })(),
    attachment: null,
    likes: 0,
    comments: 0,
    liked: false,
    saved: false
  };
}

/* ── Feed with Lazy Loading ────────────────────────────────────────────────── */
const Feed = () => {
  const [allPosts, setAllPosts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [visiblePosts, setVisiblePosts] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [page, setPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [initialLoading, setInitialLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [loadingMore, setLoadingMore] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [hasMore, setHasMore] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const sentinelRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const ctx = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    all: [],
    page: 1,
    busy: false,
    hasMore: false
  });

  /* ── CHANGED: fetch from Supabase instead of /mock.json ─────────────────── */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!window.SupabaseUtils) {
      setError('Supabase not ready. Please try again.');
      setInitialLoading(false);
      return;
    }
    window.SupabaseUtils.client.from('posts').select('*').order('post_id', {
      ascending: false
    }).then(({
      data,
      error: dbError
    }) => {
      if (dbError) {
        setError(dbError.message);
        setInitialLoading(false);
        return;
      }
      const mapped = (data || []).map(mapRowToPost);
      const initial = mapped.slice(0, POSTS_PER_PAGE);
      const more = mapped.length > POSTS_PER_PAGE;
      ctx.current = {
        all: mapped,
        page: 1,
        busy: false,
        hasMore: more
      };
      setAllPosts(mapped);
      setVisiblePosts(initial);
      setHasMore(more);
      setInitialLoading(false);
    });
  }, []);

  /* ── CHANGED: new post saves to Supabase and prepends to feed ───────────── */
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const handleNewPost = ({
      detail
    }) => {
      const {
        title = '',
        text = '',
        images = [],
        attachments = [],
        links = []
      } = detail;
      const mimeLabel = mime => mime === 'video/mp4' ? 'MP4 · video' : 'PDF · document';
      let attachment = null;
      if (attachments.length > 0) {
        attachment = {
          name: attachments[0].name,
          type: mimeLabel(attachments[0].mimeType)
        };
      } else if (links.length > 0) {
        attachment = {
          name: links[0].replace(/^https?:\/\//, ''),
          type: 'Google Drive · link'
        };
      }
      const extractedTags = `${text} ${title}`.match(/#\w+/g) || [];
      const newPost = {
        id: Date.now(),
        user: {
          name: 'You',
          role: 'Member',
          avatar: 'U',
          color: '#0073e6'
        },
        timeAgo: 'Just now',
        title: title || null,
        text,
        tags: extractedTags,
        images: images.map(img => img.url),
        attachment,
        likes: 0,
        comments: 0,
        liked: false,
        saved: false
      };

      // Optimistically add to feed immediately
      setAllPosts(prev => [newPost, ...prev]);
      setVisiblePosts(prev => [newPost, ...prev]);

      // Save to Supabase in the background
      if (window.SupabaseUtils) {
        window.SupabaseUtils.client.from('posts').insert({
          user_name: 'You',
          user_role: 'Member',
          post_description: text,
          tags: extractedTags.join(', '),
          media: images.length > 0 ? JSON.stringify(images.map(img => img.url)) : null
        }).then(({
          error: dbError
        }) => {
          if (dbError) {
            console.error('Failed to save post to Supabase:', dbError.message);
          }
        });
      }
    };
    document.addEventListener('post-bar:submit', handleNewPost);
    return () => document.removeEventListener('post-bar:submit', handleNewPost);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    ctx.current = {
      all: allPosts,
      page,
      busy: loadingMore,
      hasMore
    };
  }, [allPosts, page, loadingMore, hasMore]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialLoading) return undefined;
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const loadNext = () => {
      const {
        all,
        page: pg,
        busy,
        hasMore: more
      } = ctx.current;
      if (busy || !more) return;
      ctx.current = {
        ...ctx.current,
        busy: true
      };
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
          hasMore: stillMore
        };
      }, 700);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadNext();
    }, {
      threshold: 0.1
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [initialLoading]);
  if (initialLoading) return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "feed-status",
    children: "Loading feed\u2026"
  });
  if (error) return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "feed-status feed-status-error",
    children: error
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "feed",
    children: [visiblePosts.map(post => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(FeedCard, {
      post: post
    }, post.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      ref: sentinelRef,
      className: "feed-sentinel",
      "aria-hidden": "true",
      children: [loadingMore && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
        className: "feed-spinner"
      }), !hasMore && !loadingMore && visiblePosts.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
        className: "feed-end-message",
        children: "You're all caught up!"
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Feed);

/***/ }),

/***/ "./react-app/app/feed/index.jsx":
/*!**************************************!*\
  !*** ./react-app/app/feed/index.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decorateBlock: () => (/* binding */ decorateBlock),
/* harmony export */   "default": () => (/* binding */ decorate)
/* harmony export */ });
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles/index.css */ "./react-app/app/feed/styles/index.css");
/* harmony import */ var _components_app_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/app.jsx */ "./react-app/app/feed/components/app.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/jsx-runtime.js");




async function decorateBlock(block) {
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_0__.createRoot)(block);
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_app_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
}
async function decorate(block) {
  await decorateBlock(block);
}

/***/ }),

/***/ "./react-app/app/feed/styles/index.css":
/*!*********************************************!*\
  !*** ./react-app/app/feed/styles/index.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/chunk loaded */
/******/ (() => {
/******/ 	var deferred = [];
/******/ 	__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 		if(chunkIds) {
/******/ 			priority = priority || 0;
/******/ 			for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 			deferred[i] = [chunkIds, fn, priority];
/******/ 			return;
/******/ 		}
/******/ 		var notFulfilled = Infinity;
/******/ 		for (var i = 0; i < deferred.length; i++) {
/******/ 			var [chunkIds, fn, priority] = deferred[i];
/******/ 			var fulfilled = true;
/******/ 			for (var j = 0; j < chunkIds.length; j++) {
/******/ 				if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 					chunkIds.splice(j--, 1);
/******/ 				} else {
/******/ 					fulfilled = false;
/******/ 					if(priority < notFulfilled) notFulfilled = priority;
/******/ 				}
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferred.splice(i--, 1)
/******/ 				var r = fn();
/******/ 				if (r !== undefined) result = r;
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("098b72739e4b2a5b6794")
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__webpack_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/jsonp chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"feed": 0
/******/ 	};
/******/ 	
/******/ 	// no chunk on demand loading
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ 	
/******/ 	__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 	
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 		var [chunkIds, moreModules, runtime] = data;
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 		}
/******/ 		if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		return __webpack_require__.O(result);
/******/ 	}
/******/ 	
/******/ 	var chunkLoadingGlobal = self["webpackChunk_adobe_aem_boilerplate"] = self["webpackChunk_adobe_aem_boilerplate"] || [];
/******/ 	chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 	chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module depends on other loaded chunks and execution need to be delayed
/******/ __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=localhost&port=4200&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=false&live-reload=true")))
/******/ var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./react-app/app/feed/index.jsx")))
/******/ __webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ var __webpack_exports__decorateBlock = __webpack_exports__.decorateBlock;
/******/ var __webpack_exports__default = __webpack_exports__["default"];
/******/ export { __webpack_exports__decorateBlock as decorateBlock, __webpack_exports__default as default };
/******/ 
