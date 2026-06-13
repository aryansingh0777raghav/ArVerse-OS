import React, { useState, useEffect } from 'react';

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('arverse_calendar_events');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: new Date().toDateString(), time: '09:00', text: 'ArVerse OS Integration Session', category: 'work' },
      { id: '2', date: new Date().toDateString(), time: '14:30', text: 'Review implementation plan', category: 'personal' }
    ];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [eventText, setEventText] = useState('');
  const [eventTime, setEventTime] = useState('12:00');
  const [eventCategory, setEventCategory] = useState('work');

  useEffect(() => {
    localStorage.setItem('arverse_calendar_events', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventText.trim()) return;

    const newEvent = {
      id: `evt-${Date.now()}`,
      date: selectedDate.toDateString(),
      time: eventTime,
      text: eventText.trim(),
      category: eventCategory
    };

    setEvents(prev => [...prev, newEvent].sort((a, b) => a.time.localeCompare(b.time)));
    setEventText('');
    setShowAddForm(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  // Days grid calculation
  const calendarDays = [];
  
  // Prev month's padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      month: month === 0 ? 11 : month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  // Next month's padding days to complete grid (rows of 7, up to 42 cells)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  const getDayEvents = (dayObj) => {
    const cellDateStr = new Date(dayObj.year, dayObj.month, dayObj.day).toDateString();
    return events.filter(evt => evt.date === cellDateStr);
  };

  const selectedDateEvents = events.filter(evt => evt.date === selectedDate.toDateString());

  return (
    <div className="window-content" style={{ display: 'flex', height: '100%', background: 'var(--panel-bg-solid)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>
      
      {/* Calendar Grid Side */}
      <div style={{ flex: 1.4, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', borderRight: '1px solid var(--panel-border)', overflowY: 'auto' }}>
        
        {/* Calendar Header Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>{monthNames[month]} {year}</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Today is {new Date().toDateString()}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrevMonth} style={navBtnStyle} className="glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button onClick={() => setCurrentDate(new Date())} style={{ ...navBtnStyle, fontSize: '11px', fontWeight: '600', padding: '0 10px', width: 'auto' }} className="glass">Today</button>
            <button onClick={handleNextMonth} style={navBtnStyle} className="glass">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: '700', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', flex: 1 }}>
          {calendarDays.map((cell, idx) => {
            const cellDate = new Date(cell.year, cell.month, cell.day);
            const isSelected = cellDate.toDateString() === selectedDate.toDateString();
            const isToday = cellDate.toDateString() === new Date().toDateString();
            const dayEvents = getDayEvents(cell);

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cellDate)}
                style={{
                  minHeight: '65px',
                  borderRadius: '10px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: isSelected 
                    ? 'rgba(0, 113, 227, 0.2)' 
                    : cell.isCurrentMonth ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.005)',
                  border: isSelected 
                    ? '1px solid var(--accent-color)' 
                    : isToday ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.15s ease',
                  opacity: cell.isCurrentMonth ? 1 : 0.4
                }}
                className="calendar-day-cell"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: isToday || isSelected ? '700' : '500',
                    color: isToday ? 'var(--accent-color)' : 'var(--text-primary)'
                  }}>{cell.day}</span>
                  {isToday && <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />}
                </div>

                {/* Event dots indicator */}
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {dayEvents.slice(0, 3).map((evt) => (
                    <span 
                      key={evt.id} 
                      style={{ 
                        width: '5px', 
                        height: '5px', 
                        borderRadius: '50%', 
                        backgroundColor: evt.category === 'work' ? 'var(--accent-color)' : evt.category === 'personal' ? '#34c759' : '#ff9500' 
                      }} 
                    />
                  ))}
                  {dayEvents.length > 3 && <span style={{ fontSize: '7px', fontWeight: 'bold', lineHeight: '6px' }}>+</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events / Schedule Side */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(0,0,0,0.02)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Schedule</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: 'none',
              background: 'var(--accent-color)',
              color: '#fff',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {showAddForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {/* Add Event Form */}
        {showAddForm && (
          <form onSubmit={handleAddEvent} className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700' }}>Event Details</label>
              <input 
                type="text" 
                placeholder="Meeting, Workout, Project Check..." 
                value={eventText} 
                onChange={(e) => setEventText(e.target.value)} 
                required
                style={inputStyle}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700' }}>Time</label>
                <input 
                  type="time" 
                  value={eventTime} 
                  onChange={(e) => setEventTime(e.target.value)} 
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700' }}>Category</label>
                <select 
                  value={eventCategory} 
                  onChange={(e) => setEventCategory(e.target.value)} 
                  style={inputStyle}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--accent-color)',
                color: '#fff',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Save Event
            </button>
          </form>
        )}

        {/* Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectedDateEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3, marginBottom: '8px' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div style={{ fontSize: '12px', fontWeight: '600' }}>No Events Scheduled</div>
              <div style={{ fontSize: '10.5px', opacity: 0.7 }}>Click '+ Add' to plan this day.</div>
            </div>
          ) : (
            selectedDateEvents.map(evt => (
              <div 
                key={evt.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '4px', 
                    alignSelf: 'stretch', 
                    borderRadius: '2px', 
                    backgroundColor: evt.category === 'work' ? 'var(--accent-color)' : evt.category === 'personal' ? '#34c759' : '#ff9500' 
                  }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{evt.text}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{evt.time}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteEvent(evt.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 59, 48, 0.7)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Delete event"
                  className="delete-evt-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const navBtnStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid var(--panel-border)',
  background: 'rgba(255,255,255,0.02)',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid var(--panel-border)',
  background: 'rgba(0,0,0,0.15)',
  color: 'var(--text-primary)',
  fontSize: '12px',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
