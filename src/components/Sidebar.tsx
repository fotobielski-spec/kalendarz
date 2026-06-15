import type { CalendarEvent } from '../types/event';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types/event';

interface SidebarProps {
  displayDate: string;
  events: CalendarEvent[];
  onAddEvent: () => void;
  onEditEvent: (event: CalendarEvent) => void;
}

export function Sidebar({ displayDate, events, onAddEvent, onEditEvent }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h3 className="sidebar__date">{displayDate}</h3>
        <button className="btn btn--primary btn--sm" onClick={onAddEvent}>
          + Dodaj
        </button>
      </div>

      <div className="sidebar__events">
        {events.length === 0 ? (
          <p className="sidebar__empty">Brak wydarzeń na ten dzień</p>
        ) : (
          events.map((event) => (
            <button
              key={event.id}
              className="event-card"
              onClick={() => onEditEvent(event)}
            >
              <div
                className="event-card__indicator"
                style={{ backgroundColor: CATEGORY_COLORS[event.category] }}
              />
              <div className="event-card__content">
                <span className="event-card__time">{event.time}</span>
                <span className="event-card__title">{event.title}</span>
                <span className="event-card__category">
                  {CATEGORY_LABELS[event.category]}
                </span>
                {event.description && (
                  <span className="event-card__description">{event.description}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
