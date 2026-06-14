import { useCallback, useState } from 'react';
import type { CalendarEvent } from './types/event';
import { DayCell, Header } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { Sidebar } from './components/Sidebar';
import { useEvents } from './hooks/useEvents';
import { useTheme } from './hooks/useTheme';
import {
  formatDateKey,
  formatDisplayDate,
  getCalendarDays,
  getDayNames,
  getMonthName,
} from './utils/dateUtils';
import { isToday as checkIsToday } from './utils/dateUtils';
import './App.css';

function App() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(today));
  const [modalEvent, setModalEvent] = useState<CalendarEvent | undefined>();
  const [showModal, setShowModal] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { addEvent, updateEvent, deleteEvent, getEventsForDate } = useEvents();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarDays(year, month);
  const dayNames = getDayNames();
  const selectedEvents = getEventsForDate(selectedDateKey);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateKey(formatDateKey(now));
  }, []);

  const openNewEvent = useCallback(() => {
    setModalEvent(undefined);
    setShowModal(true);
  }, []);

  const openEditEvent = useCallback((event: CalendarEvent) => {
    setModalEvent(event);
    setShowModal(true);
  }, []);

  const selectDay = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey);
  }, []);

  return (
    <div className="app">
      <Header
        year={year}
        monthName={getMonthName(month)}
        theme={theme}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onToday={goToToday}
        onToggleTheme={toggleTheme}
      />

      <main className="main">
        <div className="calendar">
          <div className="calendar__weekdays">
            {dayNames.map((name) => (
              <div key={name} className="calendar__weekday">
                {name}
              </div>
            ))}
          </div>

          <div className="calendar__grid">
            {days.map((day) => (
              <DayCell
                key={day.dateKey}
                dayNumber={day.date.getDate()}
                isCurrentMonth={day.isCurrentMonth}
                isToday={checkIsToday(day.date)}
                isSelected={day.dateKey === selectedDateKey}
                events={getEventsForDate(day.dateKey)}
                onClick={() => selectDay(day.dateKey)}
              />
            ))}
          </div>
        </div>

        <Sidebar
          displayDate={formatDisplayDate(selectedDateKey)}
          events={selectedEvents}
          onAddEvent={openNewEvent}
          onEditEvent={openEditEvent}
        />
      </main>

      {showModal && (
        <EventModal
          dateKey={selectedDateKey}
          displayDate={formatDisplayDate(selectedDateKey)}
          event={modalEvent}
          onSave={addEvent}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
