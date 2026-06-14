import type { StrefaZdjecia } from '../../types/plan';
import { mmPosStyle, photoUrl } from '../../utils/previewUtils';
import './PhotoZone.css';

interface PhotoZoneProps {
  kalId: string;
  zone: StrefaZdjecia;
  grayscale?: boolean;
}

export function PhotoZone({ kalId, zone, grayscale }: PhotoZoneProps) {
  const isPolaroid = zone.typStrefy === 'polaroid';
  const isCircle = zone.maska === 'okrag';
  const isOrganic = zone.maska?.startsWith('blob');
  const frame = zone.ramka;
  const rotation = zone.obrot ?? 0;

  const imgStyle = {
    filter: grayscale || zone.efekt === 'grayscale' ? 'grayscale(1)' : undefined,
    opacity: zone.przezroczystosc ?? 1,
  };

  const inner = (
    <img
      className="photo-zone__img"
      src={photoUrl(kalId, zone)}
      alt={zone.opis ?? zone.id}
      loading="lazy"
      style={imgStyle}
    />
  );

  return (
    <div
      className={[
        'photo-zone',
        isPolaroid && 'photo-zone--polaroid',
        isCircle && 'photo-zone--circle',
        isOrganic && 'photo-zone--organic',
        zone.typStrefy === 'tlo' && 'photo-zone--bg',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...mmPosStyle(zone.pozycja),
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        ...(frame?.kolor && frame.szerokosc
          ? { border: `${frame.szerokosc}px solid ${frame.kolor}` }
          : {}),
      }}
      title={zone.opis}
    >
      {isPolaroid ? (
        <div
          className="photo-zone__polaroid"
          style={{
            paddingBottom: frame?.marginesDolny ? `${frame.marginesDolny * 2}px` : '12%',
          }}
        >
          {inner}
        </div>
      ) : (
        inner
      )}
    </div>
  );
}
