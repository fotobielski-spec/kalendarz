import type { PozycjaMm, StrefaZdjecia } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle } from '../../utils/previewUtils';

interface LayoutZonesProps {
  photoZones: StrefaZdjecia[];
  calendarArea: PozycjaMm;
  accent: string;
}

/** Subtelne obrysy stref układu 60/40 */
export function LayoutZones({ photoZones, calendarArea, accent }: LayoutZonesProps) {
  const { pageW, pageH } = usePageSize();
  return (
    <div className="layout-zones" aria-hidden>
      {photoZones.map((z) => (
        <div
          key={`lz-${z.id}`}
          className="layout-zones__photo"
          style={{
            ...mmPosStyle(z.pozycja, pageW, pageH),
            '--zone-accent': accent,
          } as React.CSSProperties}
        />
      ))}
      <div
        className="layout-zones__calendar"
        style={{
          ...mmPosStyle(calendarArea, pageW, pageH),
          '--zone-accent': accent,
        } as React.CSSProperties}
      />
    </div>
  );
}
