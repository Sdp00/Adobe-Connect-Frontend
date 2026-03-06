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

// Compact Calendar Component with Training Names
function Calendar({ trainings, onDateSelect }) {
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

  const getTrainingForDay = (day) => {
    if (!day) return null;
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return trainings.find((training) => training.date === dateStr);
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
          const training = getTrainingForDay(day);
          return (
            <div
              key={`date-${idx}`}
              className={`calendar-day-compact${
                !day ? ' calendar-day--empty' : ''
              }${training ? ' calendar-day--event' : ''}`}
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
                  {training && (
                    <span className="calendar-event-name">
                      {training.title}
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
  trainings: PropTypes.arrayOf(
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

// Training Card Component with Decline Modal
function TrainingCard({ training, onRSVP }) {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const getStatusText = () => {
    if (training.status === 'overdue') return 'Response overdue';
    if (training.daysToRespond)
      return `Respond within ${training.daysToRespond} days`;
    return '';
  };

  const handleDeclineSubmit = () => {
    if (declineReason.trim()) {
      onRSVP(training.id, 'declined', declineReason);
      setShowDeclineModal(false);
      setDeclineReason('');
    }
  };

  const isPast = training.status === 'past';

  return (
    <>
      <div className="training-card">
        <img
          src={training.image}
          alt={training.title}
          className="training-card-img"
        />
        <div className="training-card-content">
          <h3 className="training-card-title">{training.title}</h3>

          <div className="training-card-meta">
            <div className="training-meta-item">
              <span>
                {new Date(training.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                • {training.time}
              </span>
            </div>

            <div className="training-meta-item">
              <span>{training.location}</span>
            </div>

            {!isPast && (
              <div
                className={`training-meta-item training-meta-item--${training.status}`}
              >
                <span>{getStatusText()}</span>
              </div>
            )}
          </div>

          {!isPast && !training.rsvp && (
            <div className="training-card-actions">
              <button
                type="button"
                className="btn"
                onClick={() => onRSVP(training.id, 'accepted')}
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

TrainingCard.propTypes = {
  training: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    status: PropTypes.string,
    daysToRespond: PropTypes.number,
    rsvp: PropTypes.string,
  }).isRequired,
  onRSVP: PropTypes.func.isRequired,
};

// Main Training Component with Supabase
export default function Training() {
  const [trainings, setTrainings] = useState([]);
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
    async function fetchTrainings() {
      setLoading(true);
      try {
        await waitForSupabase();

        const { data, error: fetchError } = await window.SupabaseUtils.getRecords('trainings', {
          select: 'id,title,date,time,location,image,status,daysToRespond,rsvp',
          orderBy: 'date',
          ascending: true,
        });

        if (fetchError) throw fetchError;
        setTrainings(data || []);
      } catch (err) {
        console.error('Training fetch error:', err);
        setError('Failed to fetch trainings');
      } finally {
        setLoading(false);
      }
    }

    fetchTrainings();

    window.addEventListener('trainings-updated', fetchTrainings);
    return () => window.removeEventListener('trainings-updated', fetchTrainings);
  }, []);

  const handleRSVP = async (trainingId, response, reason = null) => {
    try {
      await waitForSupabase();

      const updateData = { rsvp: response };
      if (reason) {
        updateData.declineReason = reason;
      }

      await window.SupabaseUtils.updateRecord('trainings', trainingId, updateData);

      setTrainings((prevTrainings) =>
        prevTrainings.map((training) =>
          training.id === trainingId
            ? { ...training, ...updateData }
            : training
        )
      );
    } catch (err) {
      console.error('Failed to update RSVP:', err);
    }
  };

  // ✅ Upcoming Trainings (Next 30 Days)
  const upcomingTrainings = trainings.filter((training) => {
    const trainingDate = new Date(training.date);
    trainingDate.setHours(0, 0, 0, 0);
    return trainingDate >= today && trainingDate <= thirtyDaysFromNow;
  });

  // ✅ Past Trainings (Last 30 Days)
  const pastTrainings = trainings
    .filter((training) => {
      const trainingDate = new Date(training.date);
      trainingDate.setHours(0, 0, 0, 0);
      return trainingDate >= thirtyDaysAgo && trainingDate < today;
    })
    .map((training) => ({
      ...training,
      status: 'past',
    }));

  if (loading) return <p style={{ padding: '20px', marginLeft: '240px' }}>Loading trainings…</p>;
  if (error) return <p style={{ padding: '20px', marginLeft: '240px', color: 'red' }}>{error}</p>;

  return (
    <div className="training-page">
      <div className="training-header">
        <h1>Training</h1>
      </div>

      <div className="training-top-section">
        <Calendar
          trainings={trainings}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <section className="training-section">
        <h2 className="section-title">
          Upcoming Training (Next 30 Days)
        </h2>
        <div className="training-grid">
          {upcomingTrainings.length > 0 ? (
            upcomingTrainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onRSVP={handleRSVP}
              />
            ))
          ) : (
            <p className="no-trainings-message">No upcoming trainings in the next 30 days</p>
          )}
        </div>
      </section>

      <section className="training-section">
        <h2 className="section-title">
          Past Training (Last 30 Days)
        </h2>
        <div className="training-grid">
          {pastTrainings.length > 0 ? (
            pastTrainings.map((training) => (
              <TrainingCard
                key={training.id}
                training={training}
                onRSVP={handleRSVP}
              />
            ))
          ) : (
            <p className="no-trainings-message">No past trainings in the last 30 days</p>
          )}
        </div>
      </section>
    </div>
  );
}