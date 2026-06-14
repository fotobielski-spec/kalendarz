import type { StrefaKalendarza } from '../../types/plan';
import { getDayLabels, getJanuaryDays, mmPosStyle } from '../../utils/previewUtils';
import './PrintCalendarGrid.css';

interface PrintCalendarGridProps {
  year: number;
  area: StrefaKalendarza;
  textColor: string;
  accentColor: string;
  dayFontSize?: number;
  compact?: boolean;
  backgroundColor?: string;
}

export function PrintCalendarGrid({
  year,
  area,
  textColor,
  accentColor,
  dayFontSize = 9,
  compact = false,
  backgroundColor,
}: PrintCalendarGridProps) {
  const days = getJanuaryDays(year);
  const labels = getDayLabels();

  return (
    <div
      className="print-cal"
      style={{ ...mmPosStyle(area), color: textColor, background: backgroundColor }}
    >
      <div className={`print-cal__labels${compact ? ' print-cal__labels--compact' : ''}`}>
        {labels.map((label) => (
          <span key={label} className="print-cal__label" style={{ color: accentColor }}>
            {label}
          </span>
        ))}
      </div>
      <div className={`print-cal__grid${compact ? ' print-cal__grid--compact' : ''}`}>
        {days.map((d, i) => (
          <span
            key={i}
            className={[
              'print-cal__day',
              !d.isCurrentMonth && 'print-cal__day--muted',
              d.isWeekend && d.isCurrentMonth && 'print-cal__day--weekend',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ fontSize: `${dayFontSize}px` }}
          >
            {d.day ?? ''}
          </span>
        ))}
      </div>
    </div>
  );
}
