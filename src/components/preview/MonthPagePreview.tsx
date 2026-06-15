import type { Kalendarium, StronaMiesiaca, StronaRoczna } from '../../types/plan';
import { PageSizeContext } from '../../context/PageSizeContext';
import { fontStack } from '../../utils/fonts';
import { getLayoutOrientation, getUkladLabel } from '../../utils/layoutLabels';
import { fitTitleInCalendarZone } from '../../utils/typographyFit';
import type { PageFormat } from '../../utils/previewUtils';
import {
  getPageDimensions,
  isLandscapeOrientation,
  januarySeasonPalette,
  mmPosStyle,
  mmToPercent,
  resolvePaletteValue,
} from '../../utils/previewUtils';
import { BottomStripCalendarGrid } from './BottomStripCalendarGrid';
import { LayoutZones } from './LayoutZones';
import { PageDecorations } from './PageDecorations';
import { PhotoZone } from './PhotoZone';
import { PlannerCalendarGrid } from './PlannerCalendarGrid';
import { PrintCalendarGrid } from './PrintCalendarGrid';
import { RadialCalendarGrid } from './RadialCalendarGrid';
import { TripleCalendarGrid } from './TripleCalendarGrid';
import { VerticalCalendarGrid } from './VerticalCalendarGrid';
import { YearPosterGrid } from './YearPosterGrid';
import './LayoutZones.css';
import './MonthPagePreview.css';

interface MonthPagePreviewProps {
  kalendarium: Kalendarium;
  year?: number;
  scale?: number;
  variant?: 'card' | 'focus';
  showProportion?: boolean;
  showLayoutZones?: boolean;
  hideMeta?: boolean;
  pageFormat?: PageFormat;
}

function getJanuaryPage(k: Kalendarium): StronaMiesiaca | undefined {
  return k.strony.find((s) => s.typ === 'miesiac' && s.miesiac === 1) as StronaMiesiaca | undefined;
}

function getYearPage(k: Kalendarium): StronaRoczna | undefined {
  return k.strony.find((s) => s.typ === 'rok') as StronaRoczna | undefined;
}

export function MonthPagePreview({
  kalendarium,
  year = 2026,
  scale = 1,
  variant = 'card',
  showProportion = false,
  showLayoutZones = false,
  hideMeta = false,
  pageFormat = 'A4',
}: MonthPagePreviewProps) {
  const yearPage = getYearPage(kalendarium);
  const monthPage = getJanuaryPage(kalendarium);
  const page = yearPage ?? monthPage;
  if (!page) return null;

  const isYearly = page.typ === 'rok';
  const monthOnlyPage = isYearly ? null : monthPage;

  const isLandscape = isLandscapeOrientation(kalendarium.orientacja)
    || kalendarium.kolekcja === 'poziome';
  const { pageW, pageH, layoutScale } = getPageDimensions(
    isLandscape ? 'landscape' : 'portrait',
    pageFormat,
  );
  const season = kalendarium.id === 'KAL-15' ? januarySeasonPalette() : null;
  const bg = season?.tlo ?? resolvePaletteValue(kalendarium.paleta.tlo, '#FFFFFF');
  const accent = season?.akcent ?? resolvePaletteValue(kalendarium.paleta.akcent, '#333333');
  const text = resolvePaletteValue(kalendarium.paleta.tekst, '#1A1A1A');
  const isStripBottom = !isYearly && (page.uklad === 'poz-strip-bottom' || page.strefaKalendarza.uklad === 'pasek-dol');
  const isFullscreen = !isYearly && (page.uklad.includes('fullscreen') || page.uklad.includes('overlay'));
  const isRadial = page.strefaKalendarza.uklad === 'radialny';
  const isYearGrid = page.strefaKalendarza.uklad === 'roczny' || isYearly;
  const isVertical = !isYearly && (page.strefaKalendarza.uklad === 'pionowy' || page.uklad.startsWith('pion-lista'));
  const isPlanner = page.strefaKalendarza.uklad === 'planer';
  const isTriple = !isYearly && (page.strefaKalendarza.uklad === 'trojka' || kalendarium.typografia.trojka === true);
  const tripleTyp = page.strefaKalendarza.tripleTyp ?? 'trojka-klasyczna';
  const plannerTyp = page.strefaKalendarza.plannerTyp ?? 'planer-notatki';
  const isSenior = page.strefaKalendarza.uklad === 'senior' || kalendarium.typografia.senior === true;
  const isSeniorDense = kalendarium.typografia.dense === true;
  const isGrayscale = kalendarium.efekty?.zdjecia === 'grayscale';
  const monthTitle = !isYearly ? monthOnlyPage?.typografia?.nazwaMiesiaca : undefined;
  const yearTitleSpec = isYearly ? yearPage?.typografia?.tytulRoczny : undefined;
  const compact = page.strefaKalendarza.szerokosc < 95;
  const frosted = page.efektyStrony?.frostedGlass;
  const semiPanel = page.efektyStrony?.panelPolprzezroczysty;
  const proporcja = page.proporcja ?? kalendarium.proporcja;

  const headingFont = fontStack(kalendarium.typografia.naglowek);
  const bodyFont = fontStack(kalendarium.typografia.tekst);
  const daySize = kalendarium.typografia.rozmiarDzien ?? (isYearly ? 5.5 : 9);
  const layoutLabel = isYearly ? 'Plakat roczny · 12 miesięcy' : getUkladLabel(page.uklad);
  const layoutOrient = getLayoutOrientation(page.uklad);

  const fittedTitle = !isYearly
    ? fitTitleInCalendarZone(
        monthTitle, page.strefaKalendarza, isSenior ? 24 : 15, isSenior, 'Styczeń', pageW, pageH,
      )
    : null;

  const calBg =
    semiPanel ? `rgba(${hexToRgb(bg)}, 0.88)` :
    frosted ? 'transparent' :
    isSenior ? bg :
    undefined;

  const gridProps = !isYearly && fittedTitle ? {
    year,
    monthIndex: 0,
    area: page.strefaKalendarza,
    dayFontSize: daySize,
    compact,
    backgroundColor: calBg,
    headingFont,
    bodyFont,
    showImieniny: !isStripBottom,
    senior: isSenior,
    seniorDense: isSeniorDense,
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
  } : null;

  return (
    <article
      className={[
        'month-preview',
        `month-preview--${layoutOrient}`,
        variant === 'focus' && 'month-preview--focus',
        isLandscape && 'month-preview--landscape',
      ].filter(Boolean).join(' ')}
      style={{ '--preview-scale': scale } as React.CSSProperties}
    >
      {!hideMeta && (
      <header className="month-preview__meta">
        <span className="month-preview__id">{kalendarium.id}</span>
        <h3 className="month-preview__name">{kalendarium.nazwa}</h3>
        <span className="month-preview__layout" title={page.uklad}>{layoutLabel}</span>
        {kalendarium.kolekcja && (
          <span className={`month-preview__collection month-preview__collection--${kalendarium.kolekcja}`}>
            {kalendarium.kolekcja === 'tematyczne'
              ? kalendarium.kategoria
              : kalendarium.kolekcja === 'klasyczne'
                ? 'klasyczny'
                : kalendarium.kolekcja === 'pionowe'
                ? 'pionowy'
                : kalendarium.kolekcja === 'planery'
                  ? 'planer'
                  : kalendarium.kolekcja === 'senior'
                    ? 'babcia i dziadek'
                    : kalendarium.kolekcja === 'trojka'
                      ? 'trzy kalendarze'
                      : kalendarium.kolekcja === 'poziome'
                        ? 'A4 poziom'
                        : kalendarium.kolekcja === 'plakat'
                          ? 'plakat 1 karta'
                  : 'art'}
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
            {proporcja.zdjecie}% foto · {proporcja.kalendarium}% kalendarz
            {isYearly ? ' · 12 mies.' : isTriple ? ' · 3× miesiąc' : ' · imieniny'}
          </span>
        )}
      </header>
      )}

      <div className="month-preview__page-wrap">
        <PageSizeContext.Provider value={{ pageW, pageH, layoutScale }}>
        <div
          className="month-preview__page"
          style={{
            background: isFullscreen ? '#111' : bg,
            color: text,
            fontFamily: bodyFont,
            '--font-heading': headingFont,
            '--font-body': bodyFont,
            '--accent': accent,
            '--page-w-mm': pageW,
            '--page-h-mm': pageH,
            ...(isSenior ? { '--senior-cal-bg': bg } as React.CSSProperties : {}),
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

          {'nakladka' in page && page.nakladka && (
            <div
              className="month-preview__overlay"
              style={{ ...mmPosStyle(page.nakladka.obszar, pageW, pageH, layoutScale), background: page.nakladka.kolor }}
            />
          )}

          {'separator' in page && page.separator && (
            <div
              className="month-preview__separator"
              style={{
                ...mmToPercent(page.separator.x, page.separator.y, page.separator.szerokosc, page.separator.wysokosc, pageW, pageH, layoutScale),
                position: 'absolute',
                background: page.separator.kolor ?? kalendarium.paleta.separator ?? '#ccc',
              }}
            />
          )}

          {isYearGrid ? (
            <YearPosterGrid
              year={year}
              area={page.strefaKalendarza}
              textColor={text}
              accentColor={accent}
              headingFont={headingFont}
              bodyFont={bodyFont}
              dayFontSize={daySize}
              showImieniny={!page.strefaKalendarza.bezImienin}
              compact={page.strefaKalendarza.kompaktowy === true}
              yearTitle={yearTitleSpec ? {
                x: yearTitleSpec.x,
                y: yearTitleSpec.y,
                szerokosc: yearTitleSpec.szerokosc,
                text: yearTitleSpec.tekst,
                fontFamily: headingFont,
                color: yearTitleSpec.kolor ?? accent,
                fontSize: `calc(${yearTitleSpec.rozmiar ?? 14} * 100cqw / ${pageW})`,
                textAlign: (yearTitleSpec.wyrownanie === 'center' ? 'center' : yearTitleSpec.wyrownanie === 'right' ? 'right' : 'left'),
                transform: yearTitleSpec.transform,
                letterSpacing: yearTitleSpec.letterSpacing ? `${yearTitleSpec.letterSpacing}px` : undefined,
                fontWeight: yearTitleSpec.waga === 'bold' ? 700 : 600,
              } : undefined}
            />
          ) : isRadial ? (
            <RadialCalendarGrid year={year} area={page.strefaKalendarza} textColor={text} accentColor={accent} />
          ) : isVertical ? (
            <VerticalCalendarGrid
              year={year}
              monthIndex={0}
              area={page.strefaKalendarza}
              textColor={isFullscreen ? '#fff' : text}
              accentColor={isFullscreen ? '#F5E6C8' : accent}
              headingFont={headingFont}
              bodyFont={bodyFont}
              monthName="Styczeń"
              yearNum={year}
              edge={page.strefaKalendarza.krawedz}
              backgroundColor={semiPanel ? calBg : undefined}
            />
          ) : isPlanner ? (
            <PlannerCalendarGrid
              year={year}
              monthIndex={0}
              area={page.strefaKalendarza}
              plannerTyp={plannerTyp}
              textColor={text}
              accentColor={accent}
              headingFont={headingFont}
              bodyFont={bodyFont}
              dayFontSize={daySize}
              monthTitle={{
                monthName: 'Styczeń',
                year,
                fontFamily: headingFont,
                color: monthTitle?.kolor ?? accent,
                fontSize: fittedTitle!.fontSizePx,
                maxWidth: fittedTitle!.maxWidthPct,
                textAlign: fittedTitle!.textAlign,
                transform: fittedTitle!.transform,
                letterSpacing: fittedTitle!.letterSpacing,
                fontWeight: monthTitle?.waga === 'bold' ? 700 : monthTitle?.waga === 'semibold' ? 600 : 500,
                fontStyle: monthTitle?.styl === 'kursywa' ? 'italic' : undefined,
                textTransform: monthTitle?.transform === 'uppercase' ? 'uppercase' : undefined,
              }}
            />
          ) : isTriple ? (
            <TripleCalendarGrid
              year={year}
              monthIndex={0}
              area={page.strefaKalendarza}
              tripleTyp={tripleTyp}
              textColor={text}
              accentColor={accent}
              headingFont={headingFont}
              bodyFont={bodyFont}
              dayFontSize={daySize}
              backgroundColor={semiPanel ? calBg : isTriple && kalendarium.paleta.tlo === '#0F172A' ? 'transparent' : bg}
              monthTitle={{
                monthName: 'Styczeń',
                year,
                fontFamily: headingFont,
                color: monthTitle?.kolor ?? accent,
                fontSize: fittedTitle!.fontSizePx,
                maxWidth: fittedTitle!.maxWidthPct,
                textAlign: fittedTitle!.textAlign,
                transform: fittedTitle!.transform,
                letterSpacing: fittedTitle!.letterSpacing,
                fontWeight: monthTitle?.waga === 'bold' ? 700 : monthTitle?.waga === 'semibold' ? 600 : 500,
                fontStyle: monthTitle?.styl === 'kursywa' ? 'italic' : undefined,
                textTransform: monthTitle?.transform === 'uppercase' ? 'uppercase' : undefined,
              }}
            />
          ) : isStripBottom ? (
            <BottomStripCalendarGrid
              year={year}
              monthIndex={0}
              area={page.strefaKalendarza}
              monthName="Styczeń"
              textColor={text}
              accentColor={accent}
              headingFont={headingFont}
              bodyFont={bodyFont}
              backgroundColor={bg}
            />
          ) : isFullscreen ? (
            <>
              <div
                className="month-preview__overlay"
                style={{ ...mmPosStyle(page.strefaKalendarza, pageW, pageH, layoutScale), background: 'rgba(0,0,0,0.55)' }}
              />
              <PrintCalendarGrid {...gridProps!} textColor="#fff" accentColor="#fff" />
            </>
          ) : (
            <PrintCalendarGrid {...gridProps!} textColor={text} accentColor={accent} />
          )}

          {showLayoutZones && !isFullscreen && (
            <LayoutZones
              photoZones={page.strefyZdjec}
              calendarArea={page.strefaKalendarza}
              accent={accent}
            />
          )}
        </div>
        </PageSizeContext.Provider>
      </div>
    </article>
  );
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '255,255,255';
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}
