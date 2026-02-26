import { useState, useEffect } from 'react';

// Calendar Component
function Calendar({ trainings, selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // February 2026

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

  const hasTraining = (day) => {
    if (!day) return false;
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return trainings.some((training) => training.date === dateStr);
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
              <button type="button" className="year-btn" aria-label="Previous year">&lt;</button>
              <span>{year}</span>
              <button type="button" className="year-btn" aria-label="Next year">&gt;</button>
            </div>
          </div>
          <button type="button" onClick={nextMonth} className="calendar-nav-btn" aria-label="Next month">&gt;</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {days.map((day, idx) => (
          <div
            key={`day-${idx}`}
            className={`calendar-day${!day ? ' calendar-day--empty' : ''}${hasTraining(day) ? ' calendar-day--event' : ''}`}
          >
            {day && (
              <button
                type="button"
                className="calendar-day-btn"
                onClick={() => day && onDateSelect && onDateSelect(day)}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Quarter Filter Component
function QuarterFilter({ selectedQuarters, onQuarterChange }) {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const toggleQuarter = (q) => {
    if (selectedQuarters.includes(q)) {
      onQuarterChange(selectedQuarters.filter((quarter) => quarter !== q));
    } else {
      onQuarterChange([...selectedQuarters, q]);
    }
  };

  return (
    <div className="quarter-filter">
      <div className="quarter-filter-header">
        <h3>Quarter Filter</h3>
        <span className="quarter-year">2026</span>
        <span className="quarter-range">Q1 — Q4</span>
      </div>
      <div className="quarter-slider">
        <div className="quarter-line" />
        {quarters.map((q) => (
          <button
            key={q}
            type="button"
            className={`quarter-btn${selectedQuarters.includes(q) ? ' quarter-btn--active' : ''}`}
            onClick={() => toggleQuarter(q)}
          >
            {q}
          </button>
        ))}
      </div>
      <p className="quarter-hint">Tap quarters to adjust the range</p>
    </div>
  );
}

// Training Card Component
function TrainingCard({ training, onRSVP }) {
  const getStatusText = () => {
    if (training.status === 'overdue') return 'Response overdue';
    if (training.daysToRespond) return `Respond within ${training.daysToRespond} days`;
    return '';
  };

  return (
    <div className="training-card">
      <img src={training.image} alt={training.title} className="training-card-img" />
      <div className="training-card-content">
        <h3 className="training-card-title">{training.title}</h3>
        <div className="training-card-meta">
          <div className="training-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{new Date(training.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {training.time}</span>
          </div>
          <div className="training-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{training.location}</span>
          </div>
          {training.status !== 'past' && (
            <div className={`training-meta-item training-meta-item--${training.status}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{getStatusText()}</span>
            </div>
          )}
        </div>
        {training.status !== 'past' && !training.rsvp && (
          <div className="training-card-actions">
            <button type="button" className="training-btn training-btn--accept" onClick={() => onRSVP(training.id, 'accepted')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Accept
            </button>
            <button type="button" className="training-btn training-btn--decline" onClick={() => onRSVP(training.id, 'declined')}>
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

// Main Training Component
export default function Training() {
  const [trainings, setTrainings] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState(['Q1', 'Q2', 'Q3', 'Q4']);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetch('/data/training.json')
      .then((res) => res.json())
      .then((data) => setTrainings(data.trainings))
      .catch((err) => console.error('Failed to load trainings:', err));
  }, []);

  const handleRSVP = (trainingId, response) => {
    setTrainings((prevTrainings) =>
      prevTrainings.map((training) => (training.id === trainingId ? { ...training, rsvp: response } : training)));
  };

  const upcomingTrainings = trainings.filter((training) => training.status !== 'past' && !training.rsvp);
  const pastTrainings = trainings.filter((training) => training.status === 'past');

  return (
    <div className="training-page">
      <div className="training-header">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#eb5146" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
        <h1>Training</h1>
      </div>

      <Calendar trainings={trainings} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <QuarterFilter selectedQuarters={selectedQuarters} onQuarterChange={setSelectedQuarters} />

      <section className="training-section">
        <h2 className="section-title">Upcoming Training</h2>
        <div className="training-grid">
          {upcomingTrainings.map((training) => (
            <TrainingCard key={training.id} training={training} onRSVP={handleRSVP} />
          ))}
        </div>
      </section>

      <section className="training-section">
        <h2 className="section-title">Past Training</h2>
        <div className="training-grid">
          {pastTrainings.map((training) => (
            <TrainingCard key={training.id} training={training} onRSVP={handleRSVP} />
          ))}
        </div>
      </section>
    </div>
  );
}
