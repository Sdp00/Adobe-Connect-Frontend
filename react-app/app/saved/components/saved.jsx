import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function SavedCard({ item, onRemove }) {
  return (
    <div className="saved-card">
      <img src={item.image} alt={item.title} className="saved-card-img" />
      <div className="saved-card-content">
        <h3 className="saved-card-title">{item.title}</h3>
        <p className="saved-card-desc">{item.description || item.location}</p>
        <div className="saved-card-actions">
          <button type="button" className="btn btn-danger" onClick={() => onRemove(item.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

SavedCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
    image: PropTypes.string.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default function Saved() {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const mockSaved = [
      {
        id: 'saved-1',
        title: 'Design System Workshop',
        description: 'Learn the fundamentals of building scalable design systems',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        type: 'event',
      },
      {
        id: 'saved-2',
        title: 'Adobe Monthly - New Year Edition',
        description: 'Kickstart 2026 with insights on new features and updates',
        image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
        type: 'newsletter',
      },
    ];
    setSavedItems(mockSaved);
  }, []);

  const handleRemove = (id) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="saved-page">
      <div className="saved-header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <h1>Saved</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="saved-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h3>No saved items yet</h3>
          <p>Save events, newsletters, and trainings to find them here</p>
        </div>
      ) : (
        <div className="saved-grid">
          {savedItems.map((item) => (
            <SavedCard key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}