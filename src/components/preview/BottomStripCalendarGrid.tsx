import type { StrefaKalendarza } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import './BottomStripCalendarGrid.css';

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

  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === monthIndex;
    const d = date.getDate();
    return {
      day: isCurrentMonth ? d : null,
      isCurrentMonth,
      isToday:
        isCurrentMonth &&
        d === today.getDate() &&
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
        } as React.CSSProperties}
      >
        <div className="strip-cal__row" style={{ fontFamily: bodyFont }}>
          {cells.map((cell, i) => (
            <span
              key={i}
              className={[
                'strip-cal__cell',
                !cell.isCurrentMonth && 'strip-cal__cell--muted',
                cell.isToday && 'strip-cal__cell--today',
              ].filter(Boolean).join(' ')}
            >
              {cell.day ?? ''}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
