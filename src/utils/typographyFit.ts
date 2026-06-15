import type { StrefaKalendarza } from '../types/plan';

interface TitleConfig {
  x: number;
  y: number;
  rozmiar?: number;
  wyrownanie?: string;
  letterSpacing?: number;
}

const LONG_MONTHS = new Set(['Październik', 'Wrzesień', 'Listopad', 'Sierpień', 'Grudzień']);

/** Skala rozmiaru tytułu wg długości nazwy miesiąca i szerokości strefy */
export function scaleMonthTitleSize(monthName: string, baseSize: number, calW: number): number {
  let size = baseSize;
  if (LONG_MONTHS.has(monthName)) size -= 1.5;
  else if (monthName.length > 7) size -= 0.75;
  if (calW < 50) size -= 2;
  else if (calW < 70) size -= 1.25;
  else if (calW < 95) size -= 0.5;
  return Math.max(5.5, size);
}

/** Dopasuj tytuł miesiąca do strefy kalendarza — pełna nazwa, bez ellipsis */
export function fitTitleInCalendarZone(
  title: TitleConfig | undefined,
  cal: StrefaKalendarza,
  defaultSize = 16,
  senior = false,
  monthName?: string,
  pageW = 210,
  pageH = 297,
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
  const isSidebar = isNarrow && calH > 140;

  const rawSize = title?.rozmiar ?? defaultSize;
  const monthScaled = monthName ? scaleMonthTitleSize(monthName, rawSize, calW) : rawSize;
  const cappedSize = senior
    ? Math.min(monthScaled, calW < 95 ? 11 : calH < 120 ? 12 : 13)
    : Math.min(
      monthScaled,
      isSidebar ? 14 : isNarrow ? 13 : isShort ? 15 : 20,
    );

  const yMm = cal.y + 2;
  const xMm = title?.wyrownanie === 'center'
    ? cal.x + calW / 2
    : Math.max(cal.x + 1, Math.min(title?.x ?? cal.x + 1, cal.x + calW - 2));

  const fontSize = `calc(${cappedSize} * 100cqw / ${calW})`;
  const maxWidth = '100%';

  return {
    xPct: (xMm / pageW) * 100,
    yPct: (yMm / pageH) * 100,
    fontSizePx: fontSize,
    maxWidthPct: maxWidth,
    textAlign: title?.wyrownanie === 'center' ? 'center' : 'left',
    transform: senior ? undefined : (title?.wyrownanie === 'center' || xMm > pageW / 2 ? 'translateX(-50%)' : undefined),
    letterSpacing: title?.letterSpacing ? `${title.letterSpacing * 0.03}px` : undefined,
  };
}

export function fitDayFontSize(
  baseSize: number,
  cal: StrefaKalendarza,
  hasImieniny: boolean,
  senior = false,
  _seniorDense = false,
): number {
  if (senior) {
    const isNarrow = cal.szerokosc < 95;
    const max = isNarrow ? 12 : 14;
    return Math.max(11, Math.min(baseSize, max));
  }

  const isNarrow = cal.szerokosc < 95;
  const isShort = cal.wysokosc < 105;
  const isSidebar = isNarrow && cal.wysokosc > 140;
  const isStrip = cal.szerokosc < 58;

  let size = baseSize;
  if (isStrip) size -= 0.5;
  else if (isSidebar) size -= 0.25;
  else if (isNarrow) size -= 0.75;
  if (isShort) size -= 0.75;
  if (hasImieniny && isShort) size -= 0.5;
  else if (hasImieniny && isStrip) size -= 0.5;
  else if (hasImieniny && !isSidebar) size -= 0.5;

  const minSize = isStrip ? 5 : isSidebar ? 6.5 : isNarrow ? 6 : 5;
  return Math.max(minSize, size);
}

/** Imieniny zawsze widoczne — skalowanie w CSS, nie skracanie tekstu */
export function fitImieninyMaxLen(_cal: StrefaKalendarza, _senior = false): number {
  return 99;
}
