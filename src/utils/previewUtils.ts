import type { CSSProperties } from 'react';
import type { PozycjaMm } from '../types/plan';

export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;

const DAY_LABELS_MON = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export interface PrintDay {
  day: number | null;
  isCurrentMonth: boolean;
  isWeekend: boolean;
}

export function mmToPercent(x: number, y: number, w: number, h: number) {
  return {
    left: `${(x / A4_WIDTH) * 100}%`,
    top: `${(y / A4_HEIGHT) * 100}%`,
    width: `${(w / A4_WIDTH) * 100}%`,
    height: `${(h / A4_HEIGHT) * 100}%`,
  };
}

export function mmPosStyle(pos: PozycjaMm): CSSProperties {
  return {
    position: 'absolute',
    ...mmToPercent(pos.x, pos.y, pos.szerokosc, pos.wysokosc),
  };
}

/** Zmienne CSS do skalowania typografii względem rzeczywistej strefy (nie całego A4) */
export function zoneCssVars(area: { szerokosc: number; wysokosc: number }): Record<string, number> {
  return {
    '--zone-w-mm': area.szerokosc,
    '--zone-h-mm': area.wysokosc,
  } as Record<string, number>;
}

export function isSidebarCalendarZone(area: { szerokosc: number; wysokosc: number }): boolean {
  return area.szerokosc < 95 && area.wysokosc > 200;
}

export function getJanuaryDays(year: number): PrintDay[] {
  const month = 0;
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);

  const days: PrintDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === month;
    const dow = date.getDay();
    days.push({
      day: isCurrentMonth ? date.getDate() : null,
      isCurrentMonth,
      isWeekend: dow === 0 || dow === 6,
    });
  }
  return days;
}

export function getDayLabels(): string[] {
  return DAY_LABELS_MON;
}

export function photoSeed(kalId: string, zoneId: string): string {
  return `${kalId}-${zoneId}`.replace(/[^a-zA-Z0-9-]/g, '');
}

export function photoUrl(kalId: string, zone: { id: string; pozycja: PozycjaMm }): string {
  const seed = photoSeed(kalId, zone.id);
  const w = Math.max(100, Math.round(zone.pozycja.szerokosc * 4));
  const h = Math.max(100, Math.round(zone.pozycja.wysokosc * 4));
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export function resolvePaletteValue(value: string | undefined, fallback: string): string {
  if (!value || value === 'dynamiczna' || value === 'dynamiczny') return fallback;
  return value;
}

export function januarySeasonPalette() {
  return { tlo: '#E8F4F8', akcent: '#4A90D9' };
}
