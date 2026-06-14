import type { StrefaKalendarza } from '../types/plan';

interface TitleConfig {
  x: number;
  y: number;
  rozmiar?: number;
  wyrownanie?: string;
  letterSpacing?: number;
}

/** Dopasuj tytuł miesiąca do strefy kalendarza — bez wychodzenia poza obszar */
export function fitTitleInCalendarZone(
  title: TitleConfig | undefined,
  cal: StrefaKalendarza,
  defaultSize = 16,
): {
  xPct: number;
  yPct: number;
  fontSizePx: string;
  maxWidthPct: string;
  textAlign: 'left' | 'center' | 'right';
  transform?: string;
  letterSpacing?: string;
} {
  const calW = cal.szerokosc;
  const calH = cal.wysokosc;
  const isNarrow = calW < 95;
  const isShort = calH < 100;

  const rawSize = title?.rozmiar ?? defaultSize;
  const cappedSize = Math.min(rawSize, isNarrow ? 13 : isShort ? 15 : 20);

  const yMm = cal.y + 2;
  const xMm = title?.wyrownanie === 'center'
    ? cal.x + calW / 2
    : Math.max(cal.x + 1, Math.min(title?.x ?? cal.x + 1, cal.x + calW - 2));

  const fontSize = `calc(${cappedSize} * 100cqw / 210)`;
  const maxWidth = `${(calW / 210) * 100}%`;

  return {
    xPct: (xMm / 210) * 100,
    yPct: (yMm / 297) * 100,
    fontSizePx: fontSize,
    maxWidthPct: maxWidth,
    textAlign: title?.wyrownanie === 'center' ? 'center' : 'left',
    transform: title?.wyrownanie === 'center' || xMm > 105 ? 'translateX(-50%)' : undefined,
    letterSpacing: title?.letterSpacing ? `${title.letterSpacing * 0.03}px` : undefined,
  };
}

export function fitDayFontSize(
  baseSize: number,
  cal: StrefaKalendarza,
  hasImieniny: boolean,
): number {
  const isNarrow = cal.szerokosc < 95;
  const isShort = cal.wysokosc < 105;
  let size = baseSize;
  if (isNarrow) size -= 1.5;
  if (isShort) size -= 1;
  if (hasImieniny) size -= 0.5;
  return Math.max(5.5, size);
}
