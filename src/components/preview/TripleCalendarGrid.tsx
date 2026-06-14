import type { StrefaKalendarza } from '../../types/plan';
import { fitTitleInCalendarZone } from '../../utils/typographyFit';
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

function panelArea(area: StrefaKalendarza, szerokosc: number): StrefaKalendarza {
  return { ...area, szerokosc };
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
  const fitted = fitTitleInCalendarZone(
    { x: area.x, y: area.y, rozmiar: size, wyrownanie: 'center' },
    area,
    size,
    false,
  );
  return {
    monthName: MONTH_NAMES[monthIdx],
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

export function TripleCalendarGrid({
  year,
  monthIndex = 0,
  area,
  tripleTyp = 'trojka-klasyczna',
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  dayFontSize = 8,
  backgroundColor,
  monthTitle,
}: TripleCalendarGridProps) {
  const prevIdx = monthIndex === 0 ? 11 : monthIndex - 1;
  const prevYear = monthIndex === 0 ? year - 1 : year;
  const nextIdx = monthIndex === 11 ? 0 : monthIndex + 1;
  const nextYear = monthIndex === 11 ? year + 1 : year;

  const sideW = Math.round(area.szerokosc * 0.27);
  const mainW = area.szerokosc - sideW * 2;
  const sideArea = panelArea(area, sideW);
  const mainArea = panelArea(area, mainW);

  const mainDay = dayFontSize;
  const sideDay = Math.max(5.5, dayFontSize * 0.7);
  const mainTitleSize = tripleTyp.includes('brutalist') ? 11 : 13;
  const sideTitleSize = 8;

  const shared = {
    textColor,
    accentColor,
    headingFont,
    bodyFont,
    embedded: true as const,
    backgroundColor,
  };

  return (
    <div
      className={['triple-cal', `triple-cal--${tripleTyp}`].join(' ')}
      style={{
        ...mmPosStyle(area),
        ...zoneCssVars(area),
        color: textColor,
        background: backgroundColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--accent': accentColor,
        '--triple-side-w': sideW,
        '--triple-main-w': mainW,
      } as React.CSSProperties}
    >
      <div className="triple-cal__months">
        <div className="triple-cal__panel triple-cal__panel--prev">
          <span className="triple-cal__hint">poprzedni</span>
          <PrintCalendarGrid
            {...shared}
            year={prevYear}
            monthIndex={prevIdx}
            area={sideArea}
            dayFontSize={sideDay}
            compact
            showImieniny={false}
            monthTitle={buildTitle(prevIdx, prevYear, sideArea, headingFont, accentColor, monthTitle, sideTitleSize)}
          />
        </div>

        <div className="triple-cal__panel triple-cal__panel--main">
          <span className="triple-cal__hint triple-cal__hint--main">bieżący · imieniny</span>
          <PrintCalendarGrid
            {...shared}
            year={year}
            monthIndex={monthIndex}
            area={mainArea}
            dayFontSize={mainDay}
            showImieniny
            monthTitle={buildTitle(monthIndex, year, mainArea, headingFont, accentColor, monthTitle, mainTitleSize, tripleTyp.includes('brutalist'))}
          />
        </div>

        <div className="triple-cal__panel triple-cal__panel--next">
          <span className="triple-cal__hint">następny</span>
          <PrintCalendarGrid
            {...shared}
            year={nextYear}
            monthIndex={nextIdx}
            area={sideArea}
            dayFontSize={sideDay}
            compact
            showImieniny={false}
            monthTitle={buildTitle(nextIdx, nextYear, sideArea, headingFont, accentColor, monthTitle, sideTitleSize)}
          />
        </div>
      </div>
    </div>
  );
}
