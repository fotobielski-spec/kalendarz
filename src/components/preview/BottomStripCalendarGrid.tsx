import type { StrefaKalendarza } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import './BottomStripCalendarGrid.css';

/** Skrócone etykiety — mieszczą się w wąskich kolumnach */
const STRIP_DAY_LABELS = ['P', 'W', 'Ś', 'C', 'Pt', 'S', 'N'];

interface BottomStripCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  monthName: string;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundColor?: string;
  yearTopMm?: number;
  yearRightMm?: number;
}

export function BottomStripCalendarGrid({
  year,
  monthIndex = 0,
  area,
  monthName,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  backgroundColor,
  yearTopMm = 6,
  yearRightMm = 4,
}: BottomStripCalendarGridProps) {
  const { pageW, pageH } = usePageSize();
  const today = new Date();

  const dayLabels = STRIP_DAY_LABELS;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const colCount = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: colCount }, (_, i) => {
    if (i < startOffset || i >= startOffset + daysInMonth) {
      return { day: null, isEmpty: true, isToday: false };
    }
    const day = i - startOffset + 1;
    return {
      day,
      isEmpty: false,
      isToday:
        day === today.getDate() &&
        today.getMonth() === monthIndex &&
        year === today.getFullYear(),
    };
  });

  const yearX = pageW - yearRightMm;

  return (
    <>
      <div
        className="strip-cal__year"
        style={{
          position: 'absolute',
          left: `${(yearX / pageW) * 100}%`,
          top: `${((12 + yearTopMm) / pageH) * 100}%`,
          fontFamily: headingFont,
          color: accentColor,
          transform: 'translateX(-100%)',
        }}
        aria-hidden
      >
        {year}
      </div>

      <span
        className="strip-cal__month"
        style={{
          position: 'absolute',
          left: `${((area.x + 12) / pageW) * 100}%`,
          top: `${((area.y - 5) / pageH) * 100}%`,
          fontFamily: headingFont,
          color: accentColor,
          transform: 'translateY(-100%)',
        }}
      >
        {monthName}
      </span>

      <div
        className="strip-cal"
        style={{
          ...mmPosStyle(area, pageW, pageH),
          position: 'absolute',
          color: textColor,
          background: backgroundColor,
          ...zoneCssVars(area),
          '--font-heading': headingFont,
          '--font-body': bodyFont,
          '--accent': accentColor,
          '--strip-cols': colCount,
        } as React.CSSProperties}
      >
        <div
          className="strip-cal__grid"
          style={{
            fontFamily: bodyFont,
            gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: colCount }, (_, i) => (
            <span
              key={`lab-${i}`}
              className={[
                'strip-cal__label',
                i % 7 >= 5 && 'strip-cal__label--weekend',
                (i + 1) % 7 === 0 && 'strip-cal__col-end',
              ].filter(Boolean).join(' ')}
              style={{ gridColumn: i + 1, gridRow: 1 }}
            >
              {dayLabels[i % 7]}
            </span>
          ))}
          {cells.map((cell, i) => (
            <span
              key={`day-${i}`}
              className={[
                'strip-cal__cell',
                cell.isEmpty && 'strip-cal__cell--empty',
                cell.isToday && 'strip-cal__cell--today',
                (i + 1) % 7 === 0 && 'strip-cal__col-end',
              ].filter(Boolean).join(' ')}
              style={{ gridColumn: i + 1, gridRow: 2 }}
            >
              <span className="strip-cal__num">{cell.day ?? ''}</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
