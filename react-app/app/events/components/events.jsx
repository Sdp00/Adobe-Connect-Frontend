import { useState, useEffect } from 'react';

// ─── Parse EDS Block ────────────────────────────────────────────────────────
// Reads your da.live "Events" document block (a table rendered as divs by EDS)
// Expected column order in your da.live table:
// | Title | Date (YYYY-MM-DD) | Time | Location | Image | Status | Days To Respond |
function parseEDSBlock(block) {
  if (!block) return [];

  // EDS renders table rows as: .events > div (row) > div (cell)
  const rows = Array.from(block.querySelectorAll(':scope > div'));

  return rows
    .map((row, idx) => {
      const cells = Array.from(row.querySelectorAll(':scope > div'));
      const getText = (i) => cells[i]?.textContent?.trim() || '';
      const getImg = (i) => cells[i]?.querySelector('picture img, img')?.src || '';

      const title = getText(0);
      if (!title) return null; // skip empty rows / header rows

      return {
        id: idx + 1,
        title,
        date: getText(1),
        time: getText(2),
        location: getText(3),
        image: getImg(4) || getText(4),
        status: getText(5) || 'pending',
        daysToRespond: getText(6) ? parseInt(getText(6), 10) : null,
        rsvp: null,
      };
    })
    .filter(Boolean);
}

// ─── Calendar ───────────────────────────────────────────────────────────────
function Calendar({ events, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i += 1) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i += 1) days.push(i);
    return days;
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some((e) => e.date === dateStr);
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const year = currentMonth.getFullYear();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2>Calendar</h2>
        </div>
        <div className="calendar-nav">
          <button type="button" onClick={prevMonth} className="calendar-nav-btn" aria-label="Previous month">&lt;</button>
          <div className="calendar-month">
            <span className="month-name">{monthName}</span>
            <div className="year-controls">
              <span>{year}</span>
            </div>
          </div>
          <button type="button" onClick={nextMonth} className="calendar-nav-btn" aria-label="Next month">&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
        {days.map((day, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`day-${idx}`} className={`calendar-day${!day ? ' calendar-day--empty' : ''}${hasEvent(day) ? ' calendar-day--event' : ''}`}>
            {day && (
              <button type="button" className="calendar-day-btn" onClick={() => onDateSelect && onDateSelect(day)}>
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quarter Filter ──────────────────────────────────────────────────────────
function QuarterFilter({ selectedQuarters, onQuarterChange }) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const toggle = (q) => {
    if (selectedQuarters.includes(q)) {
      onQuarterChange(selectedQuarters.filter((x) => x !== q));
    } else {
      onQuarterChange([...selectedQuarters, q]);
    }
  };

  return (
    <div className="quarter-filter">
      <div className="quarter-filter-header">
        <h3>Quarter Filter</h3>
        <span className="quarter-year">{new Date().getFullYear()}</span>
        <span className="quarter-range">Q1 — Q4</span>
      </div>
      <div className="quarter-slider">
        <div className="quarter-line" />
        {quarters.map((q) => (
          <button
            key={q}
            type="button"
            className={`quarter-btn${selectedQuarters.includes(q) ? ' quarter-btn--active' : ''}`}
            onClick={() => toggle(q)}
          >
            {q}
          </button>
        ))}
      </div>
      <p className="quarter-hint">Tap quarters to adjust the range</p>
    </div>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────────
function EventCard({ event, onRSVP }) {
  const getStatusText = () => {
    if (event.status === 'overdue') return 'Response overdue';
    if (event.daysToRespond) return `Respond within ${event.daysToRespond} days`;
    return '';
  };

  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return event.date;
    }
  })();

  return (
    <div className="event-card">
      {event.image && <img src={event.image} alt={event.title} className="event-card-img" />}
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <div className="event-card-meta">
          <div className="event-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formattedDate}{event.time ? ` • ${event.time}` : ''}</span>
          </div>
          {event.location && (
            <div className="event-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          {event.status !== 'past' && getStatusText() && (
            <div className={`event-meta-item event-meta-item--${event.status}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{getStatusText()}</span>
            </div>
          )}
        </div>

        {event.rsvp && (
          <div className={`event-rsvp-badge event-rsvp-badge--${event.rsvp}`}>
            {event.rsvp === 'accepted' ? '✓ Accepted' : '✗ Declined'}
          </div>
        )}

        {event.status !== 'past' && !event.rsvp && (
          <div className="event-card-actions">
            <button type="button" className="event-btn event-btn--accept" onClick={() => onRSVP(event.id, 'accepted')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Accept
            </button>
            <button type="button" className="event-btn event-btn--decline" onClick={() => onRSVP(event.id, 'declined')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Events Component ───────────────────────────────────────────────────
const Events = ({ block }) => {
  const [events, setEvents] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState(['Q1', 'Q2', 'Q3', 'Q4']);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (block) {
      // EDS mode: parse the block DOM that da.live rendered
      const parsed = parseEDSBlock(block);
      setEvents(parsed);
      setLoading(false);
    } else {
      // Dev/fallback mode: fetch from JSON
      fetch('/data/events.json')
        .then((res) => res.json())
        .then((data) => {
          setEvents(data.events || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load events:', err);
          setLoading(false);
        });
    }
  }, [block]);

  const handleRSVP = (eventId, response) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, rsvp: response } : e)));
  };

  const upcomingEvents = events.filter((e) => e.status !== 'past' && !e.rsvp);
  const pastEvents = events.filter((e) => e.status === 'past');

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="8" y1="14" x2="16" y2="14" />
          <line x1="8" y1="18" x2="12" y2="18" />
        </svg>
        <h1>Events</h1>
      </div>

      <Calendar events={events} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <QuarterFilter selectedQuarters={selectedQuarters} onQuarterChange={setSelectedQuarters} />

      <section className="events-section">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="events-grid">
          {upcomingEvents.length === 0
            ? <p className="events-empty">No upcoming events.</p>
            : upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
            ))}
        </div>
      </section>

      <section className="events-section">
        <h2 className="section-title">Past Events</h2>
        <div className="events-grid">
          {pastEvents.length === 0
            ? <p className="events-empty">No past events.</p>
            : pastEvents.map((event) => (
              <EventCard key={event.id} event={event} onRSVP={handleRSVP} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Events;
