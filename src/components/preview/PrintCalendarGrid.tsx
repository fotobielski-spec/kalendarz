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
  headingFont?: string;
  bodyFont?: string;
}

export function PrintCalendarGrid({
  year,
  area,
  textColor,
  accentColor,
  dayFontSize = 9,
  compact = false,
  backgroundColor,
  headingFont,
  bodyFont,
}: PrintCalendarGridProps) {
  const days = getJanuaryDays(year);
  const labels = getDayLabels();
  const today = new Date();

  return (
    <div
      className={`print-cal${compact ? ' print-cal--compact' : ''}`}
      style={{
        ...mmPosStyle(area),
        color: textColor,
        background: backgroundColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--day-size': dayFontSize,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      <div className="print-cal__labels">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`print-cal__label${i >= 5 ? ' print-cal__label--weekend' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="print-cal__grid">
        {days.map((d, i) => {
          const isToday =
            d.isCurrentMonth &&
            d.day === today.getDate() &&
            today.getMonth() === 0 &&
            year === today.getFullYear();
          return (
            <span
              key={i}
              className={[
                'print-cal__day',
                !d.isCurrentMonth && 'print-cal__day--muted',
                d.isWeekend && d.isCurrentMonth && 'print-cal__day--weekend',
                isToday && 'print-cal__day--today',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {d.day ?? ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}
