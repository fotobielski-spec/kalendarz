import type { CalendarEvent } from '../types/event';
import { CATEGORY_COLORS } from '../types/event';

interface HeaderProps {
  year: number;
  monthName: string;
  theme: 'light' | 'dark';
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onToggleTheme: () => void;
}

export function Header({
  year,
  monthName,
  theme,
  onPrevMonth,
  onNextMonth,
  onToday,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo">📅</span>
        <h1 className="header__title">
          Kalendarium<span className="header__plus">+</span>
        </h1>
      </div>

      <div className="header__nav">
        <button className="btn btn--icon" onClick={onPrevMonth} aria-label="Poprzedni miesiąc">
          ‹
        </button>
        <button className="btn btn--ghost" onClick={onToday}>
          Dziś
        </button>
        <button className="btn btn--icon" onClick={onNextMonth} aria-label="Następny miesiąc">
          ›
        </button>
        <h2 className="header__month">
          {monthName} {year}
        </h2>
      </div>

      <div className="header__actions">
        <a href="/podglad-art.html" className="btn btn--ghost header__preview-link">
          Kolekcja Art
        </a>
        <a href="/podglad.html" className="btn btn--ghost header__preview-link">
          Podgląd
        </a>
        <button
          className="btn btn--icon"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Tryb ciemny' : 'Tryb jasny'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}

interface DayCellProps {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  onClick: () => void;
}

export function DayCell({
  dayNumber,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  onClick,
}: DayCellProps) {
  const classes = [
    'day-cell',
    !isCurrentMonth && 'day-cell--other-month',
    isToday && 'day-cell--today',
    isSelected && 'day-cell--selected',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick}>
      <span className="day-cell__number">{dayNumber}</span>
      {events.length > 0 && (
        <div className="day-cell__dots">
          {events.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className="day-cell__dot"
              style={{ backgroundColor: CATEGORY_COLORS[event.category] }}
            />
          ))}
          {events.length > 3 && (
            <span className="day-cell__more">+{events.length - 3}</span>
          )}
        </div>
      )}
    </button>
  );
}
