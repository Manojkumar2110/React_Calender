import React, { useState, useEffect } from 'react';
import EventModal from './EventModal';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Load events from localStorage on initial render
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        setEvents(parsedEvents);
        console.log('Loaded events from localStorage:', parsedEvents);
      } catch (error) {
        console.error('Error parsing events from localStorage:', error);
        localStorage.removeItem('calendarEvents'); // Clear invalid data
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      try {
        const eventsString = JSON.stringify(events);
        localStorage.setItem('calendarEvents', eventsString);
        console.log('Saved events to localStorage:', events);
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
    }
  }, [events]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const addEvent = (event) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    setEvents(prevEvents => {
      const existingEvents = prevEvents[dateStr] || [];
      const updatedEvents = {
        ...prevEvents,
        [dateStr]: [...existingEvents, event]
      };
      
      // This ensures the state is updated properly
      return updatedEvents;
    });
    
    setShowModal(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = events[dateStr] || [];
      
      days.push(
        <div 
          key={day} 
          className="calendar-day"
          onClick={() => handleDateClick(date)}
        >
          <div className="day-number">{day}</div>
          <div className="events-container">
            {dayEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-title">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>Previous</button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => navigateMonth(1)}>Next</button>
      </div>
      
      <div className="weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="calendar-grid">
        {renderCalendar()}
      </div>
      
      {showModal && (
        <EventModal 
          date={selectedDate}
          onClose={() => setShowModal(false)}
          onSave={addEvent}
        />
      )}
    </div>
  );
};

export default Calendar;