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
  senior = false,
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
  const isSidebar = isNarrow && calH > 200;

  const rawSize = title?.rozmiar ?? defaultSize;
  const cappedSize = senior
    ? Math.min(rawSize, calW < 120 ? 16 : 19)
    : Math.min(
      rawSize,
      isSidebar ? 14 : isNarrow ? 13 : isShort ? 15 : 20,
    );

  const yMm = cal.y + 2;
  const xMm = title?.wyrownanie === 'center'
    ? cal.x + calW / 2
    : Math.max(cal.x + 1, Math.min(title?.x ?? cal.x + 1, cal.x + calW - 2));

  const fontSize = `calc(${cappedSize} * 100cqw / ${calW})`;
  const maxWidth = senior ? '100%' : `${(calW / 210) * 100}%`;

  return {
    xPct: (xMm / 210) * 100,
    yPct: (yMm / 297) * 100,
    fontSizePx: fontSize,
    maxWidthPct: maxWidth,
    textAlign: title?.wyrownanie === 'center' ? 'center' : 'left',
    transform: senior ? undefined : (title?.wyrownanie === 'center' || xMm > 105 ? 'translateX(-50%)' : undefined),
    letterSpacing: title?.letterSpacing ? `${title.letterSpacing * 0.03}px` : undefined,
  };
}

export function fitDayFontSize(
  baseSize: number,
  cal: StrefaKalendarza,
  hasImieniny: boolean,
  senior = false,
): number {
  if (senior) {
    const isNarrow = cal.szerokosc < 120;
    let size = baseSize;
    if (hasImieniny) size -= isNarrow ? 3 : 2.5;
    return Math.max(10, Math.min(size, isNarrow ? 12 : 14));
  }

  const isNarrow = cal.szerokosc < 95;
  const isShort = cal.wysokosc < 105;
  const isSidebar = isNarrow && cal.wysokosc > 200;
  const isStrip = cal.szerokosc < 58;

  let size = baseSize;
  if (isStrip) size -= 1;
  else if (isSidebar) size -= 0.25;
  else if (isNarrow) size -= 1;
  if (isShort) size -= 1;
  if (hasImieniny && isShort) size -= 0.5;
  else if (hasImieniny && isStrip) size -= 0.75;
  else if (hasImieniny && !isSidebar) size -= 0.35;

  const minSize = isStrip ? 6 : isSidebar ? 7.5 : isNarrow ? 7 : 5.5;
  return Math.max(minSize, size);
}

/** Maks. długość skrótu imienin w komórce */
export function fitImieninyMaxLen(cal: StrefaKalendarza, senior = false): number {
  const cellW = cal.szerokosc / 7;
  if (senior) {
    return 99;
  }
  if (cal.szerokosc < 58) return 0;
  if (cal.szerokosc < 80) return 6;
  if (cellW < 14) return 7;
  if (cellW < 18) return 9;
  return 11;
}
