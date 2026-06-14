import type { StrefaKalendarza } from '../../types/plan';
import { getJanuaryDays } from '../../utils/previewUtils';
import './RadialCalendarGrid.css';

interface RadialCalendarGridProps {
  year: number;
  area: StrefaKalendarza;
  textColor: string;
  accentColor: string;
}

export function RadialCalendarGrid({ year, area, textColor, accentColor }: RadialCalendarGridProps) {
  const days = getJanuaryDays(year).filter((d) => d.isCurrentMonth && d.day !== null);
  const cx = area.srodek?.x ?? 105;
  const cy = area.srodek?.y ?? 118;
  const radius = area.promienZewn ?? 120;
  const inner = area.promienDni ?? 55;

  return (
    <div className="radial-cal">
      {days.map((d, i) => {
        const angle = (i / days.length) * 2 * Math.PI - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        return (
          <span
            key={d.day}
            className="radial-cal__day"
            style={{
              left: `${(x / 210) * 100}%`,
              top: `${(y / 297) * 100}%`,
              color: d.day === 1 ? '#fff' : textColor,
              background: d.day === 1 ? accentColor : undefined,
            }}
          >
            {d.day}
          </span>
        );
      })}
      <div
        className="radial-cal__inner"
        style={{
          left: `${((cx - inner) / 210) * 100}%`,
          top: `${((cy - inner) / 297) * 100}%`,
          width: `${((inner * 2) / 210) * 100}%`,
          height: `${((inner * 2) / 297) * 100}%`,
        }}
      />
    </div>
  );
}
