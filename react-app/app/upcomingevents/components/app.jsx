import { useEffect, useState } from 'react';

const calendarIcon = '/icons/calendar.svg';
const clockIcon = '/icons/clock.svg';
const locationIcon = '/icons/location.svg';

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({}); // accept/decline state

  // Fetch events from Supabase
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const { data, error: fetchError } = await window.SupabaseUtils.getRecords('events', {
          select: 'id,title,date,time,location,image,deadline',
          orderBy: 'date',
          ascending: true,
        });

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
  }, []);

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Handle local accept/decline
  const handleAccept = (id) => setResponses((prev) => ({ ...prev, [id]: 'accepted' }));
  const handleDecline = (id) => setResponses((prev) => ({ ...prev, [id]: 'declined' }));

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
                {event.image && <img src={event.image} alt={event.title} />}
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
                        onClick={() => handleDecline(event.id)}
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
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
