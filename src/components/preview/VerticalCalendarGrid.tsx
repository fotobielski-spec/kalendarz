import type { StrefaKalendarza } from '../../types/plan';
import { getImieniny } from '../../utils/imieniny';
import { mmPosStyle } from '../../utils/previewUtils';
import './VerticalCalendarGrid.css';

interface VerticalCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  monthName?: string;
  yearNum?: number;
  edge?: 'lewo' | 'prawo';
  backgroundColor?: string;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function VerticalCalendarGrid({
  year,
  monthIndex = 0,
  area,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  monthName = 'Styczeń',
  yearNum,
  edge = 'lewo',
  backgroundColor,
}: VerticalCalendarGridProps) {
  const totalDays = daysInMonth(year, monthIndex);
  const today = new Date();
  const isRight = edge === 'prawo' || area.krawedz === 'prawo';

  const rows = Array.from({ length: totalDays }, (_, i) => {
    const day = i + 1;
    const names = getImieniny(monthIndex + 1, day);
    const imieniny = names.map((n) => n.replace(/'ego$/, '').replace(/'ej$/, '')).join(', ');
    const isToday =
      day === today.getDate() &&
      today.getMonth() === monthIndex &&
      year === today.getFullYear();
  const dow = new Date(year, monthIndex, day).getDay();
    const isWeekend = dow === 0 || dow === 6;
    return { day, imieniny, isToday, isWeekend };
  });

  return (
    <div
      className={`vert-cal vert-cal--${isRight ? 'right' : 'left'}`}
      style={{
        ...mmPosStyle(area),
        color: textColor,
        background: backgroundColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      <div className="vert-cal__header">
        <span className="vert-cal__month" style={{ fontFamily: headingFont }}>{monthName}</span>
        {yearNum && <span className="vert-cal__year">{yearNum}</span>}
      </div>
      <div className="vert-cal__list">
        {rows.map((row) => (
          <div
            key={row.day}
            className={[
              'vert-cal__row',
              row.isToday && 'vert-cal__row--today',
              row.isWeekend && 'vert-cal__row--weekend',
            ].filter(Boolean).join(' ')}
          >
            <span className="vert-cal__num" style={{ fontFamily: headingFont }}>{row.day}</span>
            <span className="vert-cal__names" title={row.imieniny}>{row.imieniny}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
