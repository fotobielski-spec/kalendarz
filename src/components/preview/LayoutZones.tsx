import type { PozycjaMm, StrefaZdjecia } from '../../types/plan';
import { mmPosStyle } from '../../utils/previewUtils';

interface LayoutZonesProps {
  photoZones: StrefaZdjecia[];
  calendarArea: PozycjaMm;
  accent: string;
}

/** Subtelne obrysy stref układu 60/40 */
export function LayoutZones({ photoZones, calendarArea, accent }: LayoutZonesProps) {
  return (
    <div className="layout-zones" aria-hidden>
      {photoZones.map((z) => (
        <div
          key={`lz-${z.id}`}
          className="layout-zones__photo"
          style={{
            ...mmPosStyle(z.pozycja),
            '--zone-accent': accent,
          } as React.CSSProperties}
        />
      ))}
      <div
        className="layout-zones__calendar"
        style={{
          ...mmPosStyle(calendarArea),
          '--zone-accent': accent,
        } as React.CSSProperties}
      />
    </div>
  );
}
