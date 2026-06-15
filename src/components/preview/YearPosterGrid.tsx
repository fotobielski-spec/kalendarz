import type { StrefaKalendarza } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { getDayLabels, mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import './YearPosterGrid.css';

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const MONTH_NAMES_SHORT = [
  'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
  'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
];

interface YearTitleProps {
  x: number;
  y: number;
  szerokosc: number;
  text?: string;
  fontFamily?: string;
  color?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right';
  transform?: string;
  letterSpacing?: string;
  fontWeight?: number;
}

interface YearPosterGridProps {
  year: number;
  area: StrefaKalendarza;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  dayFontSize?: number;
  showImieniny?: boolean;
  compact?: boolean;
  yearTitle?: YearTitleProps;
}

function buildMonthDays(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === monthIndex;
    const dow = date.getDay();
    return {
      day: isCurrentMonth ? date.getDate() : null,
      isWeekend: dow === 0 || dow === 6,
    };
  });
}

export function YearPosterGrid({
  year,
  area,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  dayFontSize = 5,
  showImieniny = true,
  compact = false,
  yearTitle,
}: YearPosterGridProps) {
  const { pageW, pageH, layoutScale = 1 } = usePageSize();
  const cols = area.siatkaKolumny ?? 4;
  const rows = area.siatkaWiersze ?? 3;
  const gap = area.odstepMm ?? 2;
  const labels = getDayLabels();
  const useShortNames = compact || area.kompaktowy || area.szerokosc / cols < 48;

  const titleText = (yearTitle?.text ?? 'Kalendarz {rok}').replace('{rok}', String(year));

  return (
    <>
      {yearTitle && (
        <div
          className="year-poster__title"
          style={{
            position: 'absolute',
            left: `${(yearTitle.x * layoutScale / pageW) * 100}%`,
            top: `${(yearTitle.y * layoutScale / pageH) * 100}%`,
            width: `${(yearTitle.szerokosc * layoutScale / pageW) * 100}%`,
            fontFamily: yearTitle.fontFamily ?? headingFont,
            color: yearTitle.color ?? accentColor,
            fontSize: yearTitle.fontSize,
            textAlign: yearTitle.textAlign ?? 'center',
            textTransform: yearTitle.transform as React.CSSProperties['textTransform'],
            letterSpacing: yearTitle.letterSpacing,
            fontWeight: yearTitle.fontWeight ?? 700,
          }}
        >
          {titleText}
        </div>
      )}

      <div
        className={[
          'year-poster',
          compact && 'year-poster--compact',
          !showImieniny && 'year-poster--no-names',
        ].filter(Boolean).join(' ')}
        style={{
          ...mmPosStyle(area, pageW, pageH, layoutScale),
          ...zoneCssVars(area),
          color: textColor,
          '--font-heading': headingFont,
          '--font-body': bodyFont,
          '--accent': accentColor,
          '--day-size': `${dayFontSize}px`,
          '--year-cols': cols,
          '--year-rows': rows,
          '--year-gap': gap,
        } as React.CSSProperties}
      >
        <div
          className="year-poster__grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gap: `calc(${gap} * 100cqh / var(--zone-h-mm, ${area.wysokosc}))`,
          }}
        >
          {MONTH_NAMES.map((monthName, monthIndex) => {
            const days = buildMonthDays(year, monthIndex);
            const label = useShortNames ? MONTH_NAMES_SHORT[monthIndex] : monthName;
            return (
              <div key={monthName} className="year-poster__month">
                <div
                  className="year-poster__month-name"
                  style={{ fontFamily: headingFont, color: accentColor }}
                >
                  {label}
                </div>
                <div
                  className="year-poster__weekdays"
                  style={{ fontFamily: bodyFont }}
                >
                  {labels.map((d) => (
                    <span key={d} className="year-poster__wd">{d.charAt(0)}</span>
                  ))}
                </div>
                <div className="year-poster__days" style={{ fontFamily: bodyFont }}>
                  {days.map((cell, i) => (
                    <span
                      key={i}
                      className={[
                        'year-poster__day',
                        !cell.day && 'year-poster__day--empty',
                        cell.isWeekend && cell.day && 'year-poster__day--weekend',
                      ].filter(Boolean).join(' ')}
                    >
                      {cell.day ?? ''}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
