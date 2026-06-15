import type { StrefaKalendarza } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { fitTitleInCalendarZone, scaleMonthTitleSize } from '../../utils/typographyFit';
import { mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import { PrintCalendarGrid } from './PrintCalendarGrid';
import './TripleCalendarGrid.css';

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

interface MonthTitleProps {
  monthName: string;
  year: number;
  fontFamily?: string;
  color?: string;
  fontSize?: string;
  maxWidth?: string;
  textAlign?: 'left' | 'center' | 'right';
  transform?: string;
  letterSpacing?: string;
  fontWeight?: number;
  fontStyle?: string;
  textTransform?: string;
}

interface TripleCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  tripleTyp?: string;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  dayFontSize?: number;
  backgroundColor?: string;
  monthTitle?: MonthTitleProps;
}

type LayoutKind = 'rzad' | 'piramida' | 'filar' | 'rogi' | 'tasma' | 'blok' | 'nakladka';

function layoutKind(tripleTyp: string): LayoutKind {
  if (tripleTyp.includes('piramida')) return 'piramida';
  if (tripleTyp.includes('filar')) return 'filar';
  if (tripleTyp.includes('rogi')) return 'rogi';
  if (tripleTyp.includes('tasma')) return 'tasma';
  if (tripleTyp.includes('blok')) return 'blok';
  if (tripleTyp.includes('nakladka') || tripleTyp.includes('noir')) return 'nakladka';
  return 'rzad';
}

function panelArea(area: StrefaKalendarza, szerokosc: number, wysokosc = area.wysokosc): StrefaKalendarza {
  return { ...area, szerokosc, wysokosc };
}

function buildTitle(
  monthIdx: number,
  yr: number,
  area: StrefaKalendarza,
  headingFont: string | undefined,
  accent: string,
  monthTitle: MonthTitleProps | undefined,
  size: number,
  uppercase = false,
) {
  const monthName = MONTH_NAMES[monthIdx];
  const scaledSize = scaleMonthTitleSize(monthName, size, area.szerokosc);
  const fitted = fitTitleInCalendarZone(
    { x: area.x, y: area.y, rozmiar: scaledSize, wyrownanie: 'center' },
    area,
    scaledSize,
    false,
    monthName,
  );
  return {
    monthName,
    year: yr,
    fontFamily: headingFont,
    color: monthTitle?.color ?? accent,
    fontSize: fitted.fontSizePx,
    maxWidth: fitted.maxWidthPct,
    textAlign: 'center' as const,
    fontWeight: monthTitle?.fontWeight ?? 600,
    textTransform: uppercase ? 'uppercase' as const : monthTitle?.textTransform,
    letterSpacing: monthTitle?.letterSpacing,
  };
}

function panelDims(
  area: StrefaKalendarza,
  kind: LayoutKind,
): { main: StrefaKalendarza; side: StrefaKalendarza; mainDay: number; sideDay: number } {
  const base = area.wysokosc;
  const w = area.szerokosc;

  switch (kind) {
    case 'piramida':
      return {
        main: panelArea(area, w, Math.round(base * 0.58)),
        side: panelArea(area, Math.round(w * 0.48), Math.round(base * 0.38)),
        mainDay: 0,
        sideDay: 0,
      };
    case 'filar':
      return {
        main: panelArea(area, Math.round(w * 0.58), base),
        side: panelArea(area, Math.round(w * 0.38), Math.round(base * 0.47)),
        mainDay: 0,
        sideDay: 0,
      };
    case 'rogi':
      return {
        main: panelArea(area, w, Math.round(base * 0.62)),
        side: panelArea(area, Math.round(w * 0.3), Math.round(base * 0.32)),
        mainDay: 0,
        sideDay: 0,
      };
    case 'tasma':
      return {
        main: panelArea(area, Math.round(w * 0.56), base),
        side: panelArea(area, Math.round(w * 0.2), base),
        mainDay: 0,
        sideDay: 0,
      };
    case 'blok':
      return {
        main: panelArea(area, w, Math.round(base * 0.55)),
        side: panelArea(area, Math.round(w * 0.48), Math.round(base * 0.38)),
        mainDay: 0,
        sideDay: 0,
      };
    case 'nakladka':
      return {
        main: panelArea(area, Math.round(w * 0.5), base),
        side: panelArea(area, Math.round(w * 0.22), base),
        mainDay: 0,
        sideDay: 0,
      };
    default:
      return {
        main: panelArea(area, Math.round(w * 0.46), base),
        side: panelArea(area, Math.round(w * 0.25), base),
        mainDay: 0,
        sideDay: 0,
      };
  }
}

export function TripleCalendarGrid({
  year,
  monthIndex = 0,
  area,
  tripleTyp = 'trojka-rzad',
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  dayFontSize = 8,
  backgroundColor,
  monthTitle,
}: TripleCalendarGridProps) {
  const { pageW, pageH, layoutScale = 1 } = usePageSize();
  const prevIdx = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const nextIdx = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;

  const kind = layoutKind(tripleTyp);
  const dims = panelDims(area, kind);
  const mainDay = dayFontSize;
  const sideDay = Math.max(5, dayFontSize * (kind === 'tasma' ? 0.62 : 0.68));
  const mainTitleSize = tripleTyp.includes('brutalist') || tripleTyp.includes('blok') ? 11 : 12;
  const sideTitleSize = 7;

  const shared = {
    textColor,
    accentColor,
    headingFont,
    bodyFont,
    embedded: true as const,
    backgroundColor,
  };

  const layoutClass = `triple-cal--layout-${kind}`;

  return (
    <div
      className={['triple-cal', layoutClass, `triple-cal--${tripleTyp}`].join(' ')}
      style={{
        ...mmPosStyle(area, pageW, pageH, layoutScale),
        ...zoneCssVars(area),
        color: textColor,
        background: backgroundColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      {kind === 'nakladka' && <div className="triple-cal__veil" aria-hidden />}
      {kind === 'rogi' && <div className="triple-cal__connector" aria-hidden />}

      <div className="triple-cal__months">
        <div className="triple-cal__panel triple-cal__panel--prev">
          <span className="triple-cal__hint">{MONTH_NAMES[prevIdx]}</span>
          <PrintCalendarGrid
            {...shared}
            year={prevYear}
            monthIndex={prevIdx}
            area={dims.side}
            dayFontSize={sideDay}
            compact
            showImieniny={false}
            monthTitle={buildTitle(prevIdx, prevYear, dims.side, headingFont, accentColor, monthTitle, sideTitleSize)}
          />
        </div>

        <div className="triple-cal__panel triple-cal__panel--main">
          <span className="triple-cal__hint triple-cal__hint--main">
            {MONTH_NAMES[monthIndex]} · imieniny
          </span>
          <PrintCalendarGrid
            {...shared}
            year={year}
            monthIndex={monthIndex}
            area={dims.main}
            dayFontSize={mainDay}
            showImieniny
            monthTitle={buildTitle(
              monthIndex, year, dims.main, headingFont, accentColor, monthTitle, mainTitleSize,
              tripleTyp.includes('brutalist'),
            )}
          />
        </div>

        <div className="triple-cal__panel triple-cal__panel--next">
          <span className="triple-cal__hint">{MONTH_NAMES[nextIdx]}</span>
          <PrintCalendarGrid
            {...shared}
            year={nextYear}
            monthIndex={nextIdx}
            area={dims.side}
            dayFontSize={sideDay}
            compact
            showImieniny={false}
            monthTitle={buildTitle(nextIdx, nextYear, dims.side, headingFont, accentColor, monthTitle, sideTitleSize)}
          />
        </div>
      </div>
    </div>
  );
}
