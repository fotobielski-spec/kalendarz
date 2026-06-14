export type EventCategory = 'praca' | 'osobiste' | 'swieto' | 'inne';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: EventCategory;
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  praca: 'Praca',
  osobiste: 'Osobiste',
  swieto: 'Święto',
  inne: 'Inne',
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  praca: '#3b82f6',
  osobiste: '#10b981',
  swieto: '#f59e0b',
  inne: '#8b5cf6',
};
