import type { Kalendarium, StronaMiesiaca } from '../../types/plan';
import {
  januarySeasonPalette,
  mmPosStyle,
  mmToPercent,
  resolvePaletteValue,
} from '../../utils/previewUtils';
import { PhotoZone } from './PhotoZone';
import { PrintCalendarGrid } from './PrintCalendarGrid';
import { RadialCalendarGrid } from './RadialCalendarGrid';
import './MonthPagePreview.css';

interface MonthPagePreviewProps {
  kalendarium: Kalendarium;
  year?: number;
  scale?: number;
}

function getJanuaryPage(k: Kalendarium): StronaMiesiaca | undefined {
  return k.strony.find((s) => s.typ === 'miesiac' && s.miesiac === 1) as StronaMiesiaca | undefined;
}

export function MonthPagePreview({ kalendarium, year = 2026, scale = 1 }: MonthPagePreviewProps) {
  const page = getJanuaryPage(kalendarium);
  if (!page) return null;

  const season = kalendarium.id === 'KAL-15' ? januarySeasonPalette() : null;
  const bg = season?.tlo ?? resolvePaletteValue(kalendarium.paleta.tlo, '#FFFFFF');
  const accent = season?.akcent ?? resolvePaletteValue(kalendarium.paleta.akcent, '#333333');
  const text = resolvePaletteValue(kalendarium.paleta.tekst, '#1A1A1A');
  const isFullscreen = page.uklad.includes('fullscreen');
  const isRadial = page.strefaKalendarza.uklad === 'radialny';
  const isGrayscale = kalendarium.efekty?.zdjecia === 'grayscale';
  const monthTitle = page.typografia?.nazwaMiesiaca;
  const compact = page.strefaKalendarza.szerokosc < 120;

  return (
    <article className="month-preview" style={{ '--preview-scale': scale } as React.CSSProperties}>
      <header className="month-preview__meta">
        <span className="month-preview__id">{kalendarium.id}</span>
        <h3 className="month-preview__name">{kalendarium.nazwa}</h3>
        <p className="month-preview__cat">{kalendarium.kategoria}</p>
      </header>

      <div className="month-preview__page-wrap">
        <div
          className="month-preview__page"
          style={{
            background: isFullscreen ? '#111' : bg,
            color: text,
            fontFamily: kalendarium.typografia.tekst ?? 'system-ui, sans-serif',
          }}
        >
          {page.strefyZdjec.map((zone) => (
            <PhotoZone key={zone.id} kalId={kalendarium.id} zone={zone} grayscale={isGrayscale} />
          ))}

          {page.dekoracje?.map((d, i) => {
            if (d.typ === 'nakladka' && d.obszar) {
              return (
                <div
                  key={i}
                  className="month-preview__overlay"
                  style={{
                    ...mmPosStyle(d.obszar),
                    background: d.kolor ?? 'rgba(0,0,0,0.45)',
                  }}
                />
              );
            }
            if (d.typ === 'paleta-sezonowa' && d.tlo) {
              return null;
            }
            if (d.typ === 'linia-zlota' && d.pozycja && 'szerokosc' in d) {
              const p = d.pozycja as { x: number; y: number };
              return (
                <div
                  key={i}
                  className="month-preview__gold-line"
                  style={{
                    position: 'absolute',
                    left: `${(p.x / 210) * 100}%`,
                    top: `${(p.y / 297) * 100}%`,
                    width: `${((d.szerokosc ?? 186) / 210) * 100}%`,
                  }}
                />
              );
            }
            if (d.typ === 'ramka-zewnetrzna') {
              return (
                <div
                  key={i}
                  className="month-preview__outer-frame"
                  style={{ borderColor: d.kolor ?? accent, margin: `${d.margines ?? 8}px` }}
                />
              );
            }
            if (d.typ === 'motyw-sezonowy') {
              return (
                <div key={i} className="month-preview__season-badge" style={{ color: accent }}>
                  {d.sezon}
                </div>
              );
            }
            if (d.typ === 'plama-akwarelowa' && d.pozycja) {
              const p = d.pozycja as { x: number; y: number };
              return (
                <div
                  key={i}
                  className="month-preview__watercolor"
                  style={{
                    left: `${(p.x / 210) * 100}%`,
                    top: `${(p.y / 297) * 100}%`,
                    background: d.kolor,
                  }}
                />
              );
            }
            return null;
          })}

          {page.nakladka && (
            <div
              className="month-preview__overlay"
              style={{
                ...mmPosStyle(page.nakladka.obszar),
                background: page.nakladka.kolor,
              }}
            />
          )}

          {page.separator && (
            <div
              className="month-preview__separator"
              style={{
                ...mmToPercent(
                  page.separator.x,
                  page.separator.y,
                  page.separator.szerokosc,
                  page.separator.wysokosc,
                ),
                position: 'absolute',
                background: page.separator.kolor ?? kalendarium.paleta.separator ?? '#ccc',
              }}
            />
          )}

          {monthTitle && (
            <h4
              className="month-preview__month-title"
              style={{
                position: 'absolute',
                left: `${(monthTitle.x / 210) * 100}%`,
                top: `${(monthTitle.y / 297) * 100}%`,
                fontSize: `${(monthTitle.rozmiar ?? kalendarium.typografia.rozmiarMiesiac ?? 20) * 0.45}px`,
                color: monthTitle.kolor ?? (isFullscreen ? '#fff' : accent),
                fontFamily: kalendarium.typografia.naglowek ?? 'inherit',
                textAlign: (monthTitle.wyrownanie as React.CSSProperties['textAlign']) ?? 'left',
                textTransform: monthTitle.transform === 'uppercase' ? 'uppercase' : undefined,
                letterSpacing: monthTitle.letterSpacing ? `${monthTitle.letterSpacing * 0.1}px` : undefined,
                fontStyle: monthTitle.styl === 'kursywa' ? 'italic' : undefined,
                fontWeight: monthTitle.waga === 'semibold' ? 600 : monthTitle.waga === 'bold' ? 700 : 400,
                transform: monthTitle.x > 100 ? 'translateX(-50%)' : undefined,
                width: monthTitle.wyrownanie === 'center' ? '100%' : undefined,
              }}
            >
              Styczeń {year}
            </h4>
          )}

          {isRadial ? (
            <RadialCalendarGrid
              year={year}
              area={page.strefaKalendarza}
              textColor={text}
              accentColor={accent}
            />
          ) : isFullscreen ? (
            <>
              <div
                className="month-preview__overlay"
                style={{
                  ...mmPosStyle(page.strefaKalendarza),
                  background: 'rgba(0,0,0,0.55)',
                }}
              />
              <PrintCalendarGrid
                year={year}
                area={page.strefaKalendarza}
                textColor="#fff"
                accentColor="#fff"
                dayFontSize={(kalendarium.typografia.rozmiarDzien ?? 9) * 0.85}
                compact={compact}
              />
            </>
          ) : (
            <PrintCalendarGrid
              year={year}
              area={page.strefaKalendarza}
              textColor={text}
              accentColor={accent}
              dayFontSize={(kalendarium.typografia.rozmiarDzien ?? 9) * 0.85}
              compact={compact}
            />
          )}
        </div>
      </div>
    </article>
  );
}
