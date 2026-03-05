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

// Compact Calendar Component with Event Names
function Calendar({ events, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i += 1) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i += 1) {
      days.push(i);
    }
    return days;
  };

  const getEventForDay = (day) => {
    if (!day) return null;
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find((evt) => evt.date === dateStr);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );

  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  return (
    <div className="calendar-compact">
      <div className="calendar-header-compact">
        <button type="button" onClick={prevMonth} className="calendar-nav-btn">
          &lt;
        </button>
        <div className="calendar-title-compact">
          <span className="month-name">
            {monthName} {year}
          </span>
        </div>
        <button type="button" onClick={nextMonth} className="calendar-nav-btn">
          &gt;
        </button>
      </div>

      <div className="calendar-grid-compact">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
          <div key={`day-${idx}`} className="calendar-weekday-compact">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const event = getEventForDay(day);
          return (
            <div
              key={`date-${idx}`}
              className={`calendar-day-compact${
                !day ? ' calendar-day--empty' : ''
              }${event ? ' calendar-day--event' : ''}`}
            >
              {day && (
                <button
                  type="button"
                  className="calendar-day-btn-compact"
                  onClick={() =>
                    day && onDateSelect && onDateSelect(day)
                  }
                >
                  <span className="calendar-day-number">{day}</span>
                  {event && (
                    <span className="calendar-event-name">
                      {event.title}
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDateSelect: PropTypes.func,
};

Calendar.defaultProps = {
  onDateSelect: null,
};

// Event Card Component with Decline Modal
function EventCard({ event, onRSVP }) {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleDeclineSubmit = () => {
    if (declineReason.trim()) {
      onRSVP(event.id, 'declined', declineReason);
      setShowDeclineModal(false);
      setDeclineReason('');
    }
  };

  const isPast = event.status === 'past';

  return (
    <>
      <div className="event-card">
        <img
          src={event.Media || event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="event-card-img"
        />
        <div className="event-card-content">
          <h3 className="event-card-title">{event.title}</h3>

          <div className="event-card-meta">
            <div className="event-meta-item">
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                • {event.time}
              </span>
            </div>

            <div className="event-meta-item">
              <span>{event.location}</span>
            </div>
          </div>

          {!isPast && !event.rsvp && (
            <div className="event-card-actions">
              <button
                type="button"
                className="btn"
                onClick={() => onRSVP(event.id, 'accepted')}
              >
                Accept
              </button>

              <button
                type="button"
                className="btn"
                onClick={() => setShowDeclineModal(true)}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>

      {showDeclineModal && !isPast && (
        <div
          className="decline-modal-overlay"
          onClick={() => setShowDeclineModal(false)}
        >
          <div
            className="decline-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Reason for Declining</h3>

            <textarea
              className="decline-textarea"
              value={declineReason}
              onChange={(e) =>
                setDeclineReason(e.target.value)
              }
              rows="4"
            />

            <div className="decline-modal-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setShowDeclineModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn"
                onClick={handleDeclineSubmit}
                disabled={!declineReason.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    Media: PropTypes.string,
    image: PropTypes.string,
    status: PropTypes.string,
    rsvp: PropTypes.string,
  }).isRequired,
  onRSVP: PropTypes.func.isRequired,
};

// Main Events Component
export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ Dynamic real current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysFromNow = new Date(today);
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        await waitForSupabase();

        const { data, error: fetchError } = await window.SupabaseUtils.getRecords('events', {
          select: 'id,title,date,time,location,Media',
          orderBy: 'date',
          ascending: true,
        });

        if (fetchError) throw fetchError;

        // Map Media to image for consistency
        const eventsWithImages = (data || []).map(evt => ({
          ...evt,
          image: evt.Media || evt.image
        }));

        setEvents(eventsWithImages);
      } catch (err) {
        console.error('Events fetch error:', err);
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    window.addEventListener('events-updated', fetchEvents);
    return () => window.removeEventListener('events-updated', fetchEvents);
  }, []);

  const handleRSVP = (eventId, response, reason = null) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.id === eventId
          ? { ...evt, rsvp: response, declineReason: reason }
          : evt
      )
    );
  };

  // ✅ Upcoming Events (Next 30 Days)
  const upcomingEvents = events.filter((evt) => {
    const eventDate = new Date(evt.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today && eventDate <= thirtyDaysFromNow;
  });

  // ✅ Past Events (Last 30 Days)
  const pastEvents = events
    .filter((evt) => {
      const eventDate = new Date(evt.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= thirtyDaysAgo && eventDate < today;
    })
    .map((evt) => ({
      ...evt,
      status: 'past',
    }));

  if (loading) return <p style={{ padding: '20px', marginLeft: '240px' }}>Loading events…</p>;
  if (error) return <p style={{ padding: '20px', marginLeft: '240px', color: 'red' }}>{error}</p>;

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Events</h1>
      </div>

      <div className="events-top-section">
        <Calendar
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <section className="events-section">
        <h2 className="section-title">
          Upcoming Events (Next 30 Days)
        </h2>
        <div className="events-grid">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onRSVP={handleRSVP}
              />
            ))
          ) : (
            <p>No upcoming events in the next 30 days</p>
          )}
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-title">
          Past Events (Last 30 Days)
        </h2>
        <div className="events-grid">
          {pastEvents.length > 0 ? (
            pastEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onRSVP={handleRSVP}
              />
            ))
          ) : (
            <p>No past events in the last 30 days</p>
          )}
        </div>
      </section>
    </div>
  );
}