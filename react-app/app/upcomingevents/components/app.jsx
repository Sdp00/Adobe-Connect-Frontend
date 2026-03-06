import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const calendarIcon = '/icons/calendar.svg';
const clockIcon = '/icons/clock.svg';
const locationIcon = '/icons/location.svg';

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

function DeclineModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState('');

  return (
    <div className="decline-modal-overlay" onClick={onClose}>
      <div className="decline-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Reason for Declining</h3>
        <textarea
          className="decline-textarea"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter your reason..."
          rows="4"
        />
        <div className="decline-modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onSubmit(reason)}
            disabled={!reason.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

DeclineModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [declineTarget, setDeclineTarget] = useState(null);

  const isAdmin = window.location.pathname === '/admin';

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        await waitForSupabase();

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const { data, error: fetchError } = await window.SupabaseUtils.client
          .from('events')
          .select('id,title,date,time,location,Media,deadline')
          .gte('date', todayStr)
          .order('date', { ascending: true });

        if (fetchError) throw fetchError;
        setEvents(data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    window.addEventListener('events-updated', fetchEvents);
    return () => window.removeEventListener('events-updated', fetchEvents);
  }, []);

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleAccept = (id) => setResponses((prev) => ({ ...prev, [id]: 'accepted' }));

  const handleDeclineSubmit = () => {
    if (declineTarget) {
      setResponses((prev) => ({ ...prev, [declineTarget]: 'declined' }));
      setDeclineTarget(null);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading events…</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <section className="upcoming-events-wrapper">
      <h2 className="upcoming-events-title">Upcoming Events</h2>

      <div className="upcoming-events-list">
        {events.map((event) => {
          const daysRemaining = getDaysRemaining(event.deadline);
          const response = responses[event.id];

          return (
            <article key={event.id} className="event-card">
              <div className="event-card-image">
                {event.Media && <img src={event.Media} alt={event.title} />}
              </div>

              <div className="event-card-content">
                <h3 className="event-card-title">{event.title}</h3>

                <p className="event-card-meta">
                  <img src={calendarIcon} className="event-icon" alt="" />
                  {event.date} • {event.time}
                </p>

                <p className="event-card-meta">
                  <img src={locationIcon} className="event-icon" alt="" />
                  {event.location}
                </p>

                {daysRemaining !== null && (
                  <p
                    className={`event-card-deadline ${
                      daysRemaining <= 3 ? 'urgent' : ''
                    }`}
                  >
                    <img src={clockIcon} className="event-icon" alt="" />
                    {daysRemaining > 0
                      ? `Respond within ${daysRemaining} day${
                        daysRemaining !== 1 ? 's' : ''
                      }`
                      : 'Response overdue'}
                  </p>
                )}

                {!isAdmin && (
                  <div className="event-card-actions">
                    {!response && (
                      <>
                        <button
                          className="event-card-button accept"
                          onClick={() => handleAccept(event.id)}
                        >
                          Accept
                        </button>

                        <button
                          className="event-card-button decline"
                          onClick={() => setDeclineTarget(event.id)}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {response === 'accepted' && (
                      <button
                        className="event-card-button accept"
                        disabled
                        style={{ cursor: 'default', opacity: 0.85 }}
                      >
                        ✓ Accepted
                      </button>
                    )}

                    {response === 'declined' && (
                      <button
                        className="event-card-button decline"
                        disabled
                        style={{ cursor: 'default', opacity: 0.85 }}
                      >
                        ✕ Declined
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {declineTarget && (
        <DeclineModal
          onClose={() => setDeclineTarget(null)}
          onSubmit={handleDeclineSubmit}
        />
      )}
    </section>
  );
}