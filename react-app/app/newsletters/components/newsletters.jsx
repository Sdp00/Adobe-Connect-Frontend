import { useState, useEffect } from 'react';

function NewsletterCard({ newsletter }) {
  return (
    <div className="newsletter-card">
      <div className="newsletter-badge">{newsletter.badge}</div>
      <img src={newsletter.image} alt={newsletter.title} className="newsletter-img" />
      <div className="newsletter-content">
        <h3 className="newsletter-title">{newsletter.title}</h3>
        <p className="newsletter-desc">{newsletter.description}</p>
        <div className="newsletter-actions">
          <a href={newsletter.url} className="newsletter-btn newsletter-btn--read">
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

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
    fetch('/data/newsletters.json')
      .then((res) => res.json())
      .then((data) => setNewsletters(data.newsletters))
      .catch((err) => console.error('Failed to load newsletters:', err));
  }, []);

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
