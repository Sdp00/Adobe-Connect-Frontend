import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function waitForSupabase() {
  return new Promise((resolve, reject) => {
    if (window.SupabaseUtils) { resolve(); return; }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (window.SupabaseUtils) {
        clearInterval(interval);
        resolve();
      } else if (attempts >= 30) {
        clearInterval(interval);
        reject(new Error('SupabaseUtils did not load in time'));
      }
    }, 100);
  });
}

function NewsletterCard({ newsletter }) {
  return (
    <div className="newsletter-card">
      <img src={newsletter.image} alt={newsletter.title} className="newsletter-img" />
      <div className="newsletter-content">
        <h3 className="newsletter-title">{newsletter.title}</h3>
        <p className="newsletter-desc">{newsletter.description}</p>
        <div className="newsletter-badge">{newsletter.badge}</div>
        <div className="newsletter-actions">
          <a href={newsletter.url} className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Read
          </a>
        </div>
      </div>
    </div>
  );
}

NewsletterCard.propTypes = {
  newsletter: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNewsletters() {
      setLoading(true);
      try {
        await waitForSupabase();

        const { data, error: fetchError } = await window.SupabaseUtils.getRecords('newsletters', {
          select: 'id,title,description,date,badge,image,url',
          orderBy: 'id',
          ascending: true,
        });

        if (fetchError) throw fetchError;
        setNewsletters(data || []);
      } catch (err) {
        console.error('Newsletter fetch error:', err);
        setError('Failed to fetch newsletters');
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();

    window.addEventListener('newsletters-updated', fetchNewsletters);
    return () => window.removeEventListener('newsletters-updated', fetchNewsletters);
  }, []);

  if (loading) return <p style={{ padding: '20px', marginLeft: '240px' }}>Loading newsletters…</p>;
  if (error) return <p style={{ padding: '20px', marginLeft: '240px', color: 'red' }}>{error}</p>;
  if (!newsletters || newsletters.length === 0) {
    return <p style={{ padding: '20px', marginLeft: '240px' }}>No newsletters found</p>;
  }

  return (
    <div className="newsletters-page">
      <div className="newsletters-header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <div>
          <h1>Newsletters</h1>
          <p className="newsletters-subtitle">Adobe Monthly Newsletters - Stay informed about company updates</p>
        </div>
      </div>

      <div className="newsletters-grid">
        {newsletters.map((newsletter) => (
          <NewsletterCard key={newsletter.id} newsletter={newsletter} />
        ))}
      </div>
    </div>
  );
}