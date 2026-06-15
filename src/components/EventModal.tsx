import { useState } from 'react';
import type { CalendarEvent, EventCategory } from '../types/event';
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from '../types/event';

interface EventModalProps {
  dateKey: string;
  displayDate: string;
  event?: CalendarEvent;
  onSave: (data: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, data: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const CATEGORIES: EventCategory[] = ['praca', 'osobiste', 'swieto', 'inne'];

export function EventModal({
  dateKey,
  displayDate,
  event,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}: EventModalProps) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [time, setTime] = useState(event?.time ?? '09:00');
  const [category, setCategory] = useState<EventCategory>(event?.category ?? 'osobiste');

  const isEditing = !!event;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      date: dateKey,
      time,
      category,
    };

    if (isEditing) {
      onUpdate(event.id, data);
    } else {
      onSave(data);
    }
    onClose();
  }

  function handleDelete() {
    if (event && confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      onDelete(event.id);
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{isEditing ? 'Edytuj wydarzenie' : 'Nowe wydarzenie'}</h3>
          <button className="btn btn--icon modal__close" onClick={onClose} aria-label="Zamknij">
            ×
          </button>
        </div>

        <p className="modal__date">{displayDate}</p>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Tytuł</span>
            <input
              className="field__input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Np. Spotkanie zespołu"
              required
              autoFocus
            />
          </label>

          <label className="field">
            <span className="field__label">Godzina</span>
            <input
              className="field__input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Kategoria</span>
            <div className="category-picker">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-picker__item${category === cat ? ' category-picker__item--active' : ''}`}
                  style={{ '--cat-color': CATEGORY_COLORS[cat] } as React.CSSProperties}
                  onClick={() => setCategory(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </label>

          <label className="field">
            <span className="field__label">Opis (opcjonalnie)</span>
            <textarea
              className="field__input field__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dodatkowe informacje..."
              rows={3}
            />
          </label>

          <div className="modal__actions">
            {isEditing && (
              <button type="button" className="btn btn--danger" onClick={handleDelete}>
                Usuń
              </button>
            )}
            <div className="modal__actions-right">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Anuluj
              </button>
              <button type="submit" className="btn btn--primary">
                {isEditing ? 'Zapisz' : 'Dodaj'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
