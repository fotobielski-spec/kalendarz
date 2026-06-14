import type { Kalendarium, StronaMiesiaca } from '../../types/plan';
import { fontStack } from '../../utils/fonts';
import { getLayoutOrientation, getUkladLabel } from '../../utils/layoutLabels';
import { fitTitleInCalendarZone } from '../../utils/typographyFit';
import {
  januarySeasonPalette,
  mmPosStyle,
  mmToPercent,
  resolvePaletteValue,
} from '../../utils/previewUtils';
import { LayoutZones } from './LayoutZones';
import { PageDecorations } from './PageDecorations';
import { PhotoZone } from './PhotoZone';
import { PrintCalendarGrid } from './PrintCalendarGrid';
import { RadialCalendarGrid } from './RadialCalendarGrid';
import './LayoutZones.css';
import './MonthPagePreview.css';

interface MonthPagePreviewProps {
  kalendarium: Kalendarium;
  year?: number;
  scale?: number;
  showProportion?: boolean;
  showLayoutZones?: boolean;
}

function getJanuaryPage(k: Kalendarium): StronaMiesiaca | undefined {
  return k.strony.find((s) => s.typ === 'miesiac' && s.miesiac === 1) as StronaMiesiaca | undefined;
}

export function MonthPagePreview({
  kalendarium,
  year = 2026,
  scale = 1,
  showProportion = false,
  showLayoutZones = false,
}: MonthPagePreviewProps) {
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
  const compact = page.strefaKalendarza.szerokosc < 95;
  const frosted = page.efektyStrony?.frostedGlass;
  const semiPanel = page.efektyStrony?.panelPolprzezroczysty;
  const proporcja = page.proporcja ?? kalendarium.proporcja;

  const headingFont = fontStack(kalendarium.typografia.naglowek);
  const bodyFont = fontStack(kalendarium.typografia.tekst);
  const daySize = kalendarium.typografia.rozmiarDzien ?? 9;
  const layoutLabel = getUkladLabel(page.uklad);
  const layoutOrient = getLayoutOrientation(page.uklad);

  const fittedTitle = fitTitleInCalendarZone(monthTitle, page.strefaKalendarza, 15);

  const calBg =
    semiPanel ? `rgba(${hexToRgb(bg)}, 0.88)` :
    frosted ? 'transparent' :
    undefined;

  const gridProps = {
    year,
    monthIndex: 0,
    area: page.strefaKalendarza,
    dayFontSize: daySize,
    compact,
    backgroundColor: calBg,
    headingFont,
    bodyFont,
    showImieniny: true,
    monthTitle: {
      monthName: 'Styczeń',
      year,
      fontFamily: headingFont,
      color: monthTitle?.kolor ?? (isFullscreen ? '#fff' : accent),
      fontSize: fittedTitle.fontSizePx,
      maxWidth: fittedTitle.maxWidthPct,
      textAlign: fittedTitle.textAlign,
      transform: fittedTitle.transform,
      letterSpacing: fittedTitle.letterSpacing,
      fontWeight: monthTitle?.waga === 'bold' ? 700 : monthTitle?.waga === 'semibold' ? 600 : 500,
      fontStyle: monthTitle?.styl === 'kursywa' ? 'italic' : undefined,
      textTransform: monthTitle?.transform === 'uppercase' ? 'uppercase' : undefined,
    },
  };

  return (
    <article
      className={`month-preview month-preview--${layoutOrient}`}
      style={{ '--preview-scale': scale } as React.CSSProperties}
    >
      <header className="month-preview__meta">
        <span className="month-preview__id">{kalendarium.id}</span>
        <h3 className="month-preview__name">{kalendarium.nazwa}</h3>
        <span className="month-preview__layout" title={page.uklad}>{layoutLabel}</span>
        {kalendarium.kolekcja && (
          <span className={`month-preview__collection month-preview__collection--${kalendarium.kolekcja}`}>
            {kalendarium.kolekcja === 'tematyczne' ? kalendarium.kategoria : 'art'}
          </span>
        )}
        <p className="month-preview__fonts">
          <span className="month-preview__font-heading" style={{ fontFamily: headingFont }}>
            {kalendarium.typografia.naglowek}
          </span>
          <span className="month-preview__font-sep">/</span>
          <span className="month-preview__font-body" style={{ fontFamily: bodyFont }}>
            {kalendarium.typografia.tekst}
          </span>
        </p>
        {showProportion && proporcja && (
          <span className="month-preview__ratio">
            {proporcja.zdjecie}% foto · {proporcja.kalendarium}% kalendarz · imieniny
          </span>
        )}
      </header>

      <div className="month-preview__page-wrap">
        <div
          className="month-preview__page"
          style={{
            background: isFullscreen ? '#111' : bg,
            color: text,
            fontFamily: bodyFont,
            '--font-heading': headingFont,
            '--font-body': bodyFont,
            '--accent': accent,
          } as React.CSSProperties}
        >
          {page.strefyZdjec.map((zone) => (
            <PhotoZone key={zone.id} kalId={kalendarium.id} zone={zone} grayscale={isGrayscale} />
          ))}

          <PageDecorations
            dekoracje={page.dekoracje ?? []}
            accent={accent}
            paleta={kalendarium.paleta}
          />

          {page.nakladka && (
            <div
              className="month-preview__overlay"
              style={{ ...mmPosStyle(page.nakladka.obszar), background: page.nakladka.kolor }}
            />
          )}

          {page.separator && (
            <div
              className="month-preview__separator"
              style={{
                ...mmToPercent(page.separator.x, page.separator.y, page.separator.szerokosc, page.separator.wysokosc),
                position: 'absolute',
                background: page.separator.kolor ?? kalendarium.paleta.separator ?? '#ccc',
              }}
            />
          )}

          {isRadial ? (
            <RadialCalendarGrid year={year} area={page.strefaKalendarza} textColor={text} accentColor={accent} />
          ) : isFullscreen ? (
            <>
              <div
                className="month-preview__overlay"
                style={{ ...mmPosStyle(page.strefaKalendarza), background: 'rgba(0,0,0,0.55)' }}
              />
              <PrintCalendarGrid {...gridProps} textColor="#fff" accentColor="#fff" />
            </>
          ) : (
            <PrintCalendarGrid {...gridProps} textColor={text} accentColor={accent} />
          )}

          {showLayoutZones && !isFullscreen && (
            <LayoutZones
              photoZones={page.strefyZdjec}
              calendarArea={page.strefaKalendarza}
              accent={accent}
            />
          )}
        </div>
      </div>
    </article>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '255,255,255';
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}
