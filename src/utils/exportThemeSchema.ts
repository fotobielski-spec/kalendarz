import type { Dekoracja, Kalendarium, PozycjaMm, StronaMiesiaca, StronaRoczna } from '../types/plan';
import { fontStack } from './fonts';
import {
  A3_HEIGHT,
  A3_WIDTH,
  A4_HEIGHT,
  A4_LANDSCAPE_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_WIDTH,
  type PageFormat,
} from './previewUtils';

const WEEKDAY_LABELS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] as const;
const STRIP_WEEKDAY_LABELS = ['P', 'W', 'Ś', 'C', 'Pt', 'S', 'N'] as const;

const COLLECTION_MAP: Record<string, string> = {
  klasyczne: 'classic',
  art: 'art',
  tematyczne: 'thematic',
  pionowe: 'vertical',
  planery: 'planner',
  senior: 'senior',
  trojka: 'triple',
  poziome: 'horizontal',
  plakat: 'poster',
};

type CalendarLayout =
  | 'week-grid'
  | 'vertical-list'
  | 'triple'
  | 'planner'
  | 'radial'
  | 'strip-bottom'
  | 'senior-grid';

function getPreviewPage(k: Kalendarium) {
  return k.strony.find((s) => s.typ === 'rok')
    ?? k.strony.find((s) => s.typ === 'miesiac' && s.miesiac === 1);
}

function zoneToRect(z: PozycjaMm) {
  return { x: z.x, y: z.y, width: z.szerokosc, height: z.wysokosc };
}

function resolveCollection(k: Kalendarium): string {
  if (k.kolekcja) return COLLECTION_MAP[k.kolekcja] ?? k.kolekcja;
  if (k.id.startsWith('KAL-')) return 'classic';
  if (k.id.startsWith('ART-')) return 'art';
  if (k.id.startsWith('TEM-')) return 'thematic';
  if (k.id.startsWith('PION-')) return 'vertical';
  if (k.id.startsWith('PLAN-')) return 'planner';
  if (k.id.startsWith('SEN-')) return 'senior';
  if (k.id.startsWith('TRZ-')) return 'triple';
  if (k.id.startsWith('POZ-')) return 'horizontal';
  if (k.id.startsWith('PLAK-')) return 'poster';
  return 'custom';
}

function detectCalendarLayout(k: Kalendarium, page: StronaMiesiaca | StronaRoczna): CalendarLayout {
  if (page.typ === 'rok' || page.strefaKalendarza.uklad === 'roczny') return 'week-grid';
  const cal = page.strefaKalendarza;
  if (page.uklad === 'poz-strip-bottom' || cal.uklad === 'pasek-dol') return 'strip-bottom';
  if (cal.uklad === 'pionowy' || page.uklad.startsWith('pion-lista')) return 'vertical-list';
  if (cal.uklad === 'trojka' || k.typografia.trojka) return 'triple';
  if (cal.uklad === 'planer') return 'planner';
  if (cal.uklad === 'radialny') return 'radial';
  if (cal.uklad === 'senior' || k.typografia.senior) return 'senior-grid';
  return 'week-grid';
}

function primaryPhotoZone(page: { strefyZdjec: { id: string; pozycja: PozycjaMm }[] }) {
  const zone = page.strefyZdjec.find((z) => z.id === 'foto') ?? page.strefyZdjec[0];
  if (!zone) return { x: 0, y: 0, width: A4_WIDTH, height: Math.round(A4_HEIGHT * 0.6) };
  return zoneToRect(zone.pozycja);
}

function mapAlign(wyrownanie?: string): 'left' | 'center' | 'right' {
  if (wyrownanie === 'center') return 'center';
  if (wyrownanie === 'right') return 'right';
  return 'left';
}

function mapDecoration(d: Dekoracja) {
  let x = 0;
  let y = 0;
  let width = 0;
  let height = 0;

  if (d.obszar) {
    x = d.obszar.x;
    y = d.obszar.y;
    width = d.obszar.szerokosc;
    height = d.obszar.wysokosc;
  } else {
    x = d.x ?? d.pozycja?.x ?? 0;
    y = d.y ?? d.pozycja?.y ?? 0;
    width = d.szerokosc ?? 0;
    height = d.wysokosc ?? 0;
  }

  const deco: Record<string, unknown> = {
    type: d.typ,
    x,
    y,
    width,
    height,
  };
  if (d.kolor) deco.color = d.kolor;
  if (d.grubosc) deco.thickness_mm = d.grubosc;
  return deco;
}

function safeMargins(
  pageW: number,
  pageH: number,
  photo: { x: number; y: number; width: number; height: number },
  cal: { x: number; y: number; width: number; height: number },
) {
  return {
    top: Math.round(Math.min(photo.y, cal.y)),
    right: Math.round(pageW - Math.max(photo.x + photo.width, cal.x + cal.width)),
    bottom: Math.round(pageH - Math.max(photo.y + photo.height, cal.y + cal.height)),
    left: Math.round(Math.min(photo.x, cal.x)),
  };
}

function nameDaysPosition(layout: CalendarLayout): string {
  if (layout === 'vertical-list') return 'beside-day-number';
  if (layout === 'strip-bottom') return 'none';
  return 'below-day-number';
}

function buildDayGrid(layout: CalendarLayout, kalendarium: Kalendarium) {
  const grid: Record<string, unknown> = {
    week_start: 'monday',
    weekday_labels: layout === 'strip-bottom' ? [...STRIP_WEEKDAY_LABELS] : [...WEEKDAY_LABELS],
    rows: 6,
    columns: 7,
    cells: 42,
    show_adjacent_month_days: true,
  };
  if (layout === 'senior-grid') grid.senior = true;
  if (kalendarium.typografia.dense) grid.dense = true;
  return grid;
}

type MonthTitleSpec = NonNullable<NonNullable<StronaMiesiaca['typografia']>['nazwaMiesiaca']>;

function buildMonthTitle(
  monthTitle: MonthTitleSpec | undefined,
  yearTitle: { x: number; y: number; rozmiar?: number; kolor?: string; wyrownanie?: string; transform?: string; letterSpacing?: number } | undefined,
  calZone: { x: number; y: number; width: number; height: number },
  kalendarium: Kalendarium,
) {
  const accent = kalendarium.paleta.akcent ?? '#333333';
  const size = kalendarium.typografia.rozmiarMiesiac ?? 12;

  if (yearTitle) {
    return {
      x: yearTitle.x,
      y: yearTitle.y,
      size_mm: yearTitle.rozmiar ?? size,
      align: mapAlign(yearTitle.wyrownanie),
      color: yearTitle.kolor ?? accent,
      transform: yearTitle.transform ?? 'uppercase',
      letter_spacing_mm: yearTitle.letterSpacing ?? 1.5,
    };
  }

  if (monthTitle) {
    return {
      x: monthTitle.x,
      y: monthTitle.y,
      size_mm: monthTitle.rozmiar ?? size,
      align: mapAlign(monthTitle.wyrownanie),
      color: monthTitle.kolor ?? accent,
      transform: monthTitle.transform ?? 'none',
      letter_spacing_mm: monthTitle.letterSpacing ?? 0,
    };
  }

  return {
    x: calZone.x + 2,
    y: calZone.y + 2,
    size_mm: size,
    align: 'left',
    color: accent,
    transform: 'none',
    letter_spacing_mm: 0,
  };
}

export function exportThemeSchema(kalendarium: Kalendarium, pageFormat: PageFormat = 'A4') {
  const page = getPreviewPage(kalendarium);
  if (!page) throw new Error(`Brak strony podglądu dla ${kalendarium.id}`);

  const isYearly = page.typ === 'rok';

  const isLandscape = kalendarium.orientacja === 'landscape' || kalendarium.kolekcja === 'poziome';
  const pageW = isLandscape
    ? (pageFormat === 'A3' ? A3_HEIGHT : A4_LANDSCAPE_WIDTH)
    : (pageFormat === 'A3' ? A3_WIDTH : A4_WIDTH);
  const pageH = isLandscape
    ? (pageFormat === 'A3' ? A3_WIDTH : A4_LANDSCAPE_HEIGHT)
    : (pageFormat === 'A3' ? A3_HEIGHT : A4_HEIGHT);

  const proporcja = page.proporcja ?? kalendarium.proporcja ?? { zdjecie: 60, kalendarium: 40 };
  const photoZone = primaryPhotoZone(page);
  const calZone = zoneToRect(page.strefaKalendarza);
  const layout = detectCalendarLayout(kalendarium, page);
  const monthTitle = page.typ === 'miesiac' ? page.typografia?.nazwaMiesiaca : undefined;
  const yearTitle = page.typ === 'rok' ? page.typografia?.tytulRoczny : undefined;
  const frosted = page.efektyStrony?.frostedGlass === true;
  const semiPanel = page.efektyStrony?.panelPolprzezroczysty === true;
  const daySize = kalendarium.typografia.rozmiarDzien ?? 9;
  const showNameDays = layout !== 'strip-bottom';

  const calendarZone: Record<string, unknown> = {
    ...calZone,
    layout,
  };
  if (page.strefaKalendarza.krawedz) calendarZone.edge = page.strefaKalendarza.krawedz;
  if (page.strefaKalendarza.plannerTyp) calendarZone.planner_type = page.strefaKalendarza.plannerTyp;
  if (page.strefaKalendarza.tripleTyp) calendarZone.triple_type = page.strefaKalendarza.tripleTyp;
  if (page.strefaKalendarza.srodek) calendarZone.center = page.strefaKalendarza.srodek;
  if (page.strefaKalendarza.promienDni) calendarZone.day_radius_mm = page.strefaKalendarza.promienDni;
  if (page.strefaKalendarza.promienZewn) calendarZone.outer_radius_mm = page.strefaKalendarza.promienZewn;

  const exportDoc: Record<string, unknown> = {
    schema_version: 1,
    units: 'mm',
    status: 'active',
    preview_mode: 'html',
    print_mode: 'print-fallback',
    id: kalendarium.id,
    name: kalendarium.nazwa,
    description: kalendarium.opis,
    collection: resolveCollection(kalendarium),
    category: kalendarium.kategoria,
    layout_code: page.uklad,
    calendar_layout: isYearly ? 'year-poster' : layout,
    page_format: {
      name: isLandscape
        ? (pageFormat === 'A3' ? 'A3 poziom' : 'A4 poziom')
        : (pageFormat === 'A3' ? 'A3 pion' : 'A4 pion'),
      width_mm: pageW,
      height_mm: pageH,
      orientation: isLandscape ? 'landscape' : 'portrait',
    },
    page_split: {
      photo_percent: proporcja.zdjecie,
      calendar_percent: proporcja.kalendarium,
    },
    photo_zone: photoZone,
    calendar_zone: calendarZone,
    day_grid: buildDayGrid(layout, kalendarium),
    name_days: {
      enabled: showNameDays,
      position: nameDaysPosition(layout),
      full_names: true,
      wrap: true,
    },
    typography: {
      heading_font: fontStack(kalendarium.typografia.naglowek),
      body_font: fontStack(kalendarium.typografia.tekst),
      day_number_size_mm: daySize,
      name_day_size_mm: Math.round(daySize * 0.62 * 10) / 10,
      month_title: buildMonthTitle(monthTitle, yearTitle, calZone, kalendarium),
    },
    colors: {
      panel_background: kalendarium.paleta.tlo ?? '#FFFFFF',
      text: kalendarium.paleta.tekst ?? '#1A1A1A',
      accent: kalendarium.paleta.akcent ?? '#333333',
      weekend: kalendarium.paleta.akcent ?? '#333333',
      panel_opacity: frosted ? 0.88 : semiPanel ? 0.9 : 0.98,
    },
    page_effects: {
      frosted_glass: frosted,
      panel_border_radius_mm: 0,
      blur_intensity_px: frosted ? 12 : 0,
    },
    decorations: (page.dekoracje ?? []).map(mapDecoration),
    sample_page: isYearly
      ? { type: 'year', month: 0, label: page.etykieta }
      : { type: 'month', month: (page as StronaMiesiaca).miesiac, label: page.etykieta },
    safe_margins_mm: safeMargins(pageW, pageH, photoZone, calZone),
  };

  if (isYearly) {
    exportDoc.year_poster = {
      grid_columns: page.strefaKalendarza.siatkaKolumny ?? 4,
      grid_rows: page.strefaKalendarza.siatkaWiersze ?? 3,
      gap_mm: page.strefaKalendarza.odstepMm ?? 2,
      months: 12,
      single_page: true,
    };
  }

  if (layout === 'vertical-list') {
    exportDoc.day_list = {
      orientation: 'vertical',
      edge: page.strefaKalendarza.krawedz ?? 'lewo',
      rows: 'dynamic',
      columns: 2,
      column_1: 'day-number',
      column_2: 'name-days',
    };
  }

  if (layout === 'triple') {
    exportDoc.triple_calendar = {
      enabled: true,
      type: page.strefaKalendarza.tripleTyp ?? 'trojka-klasyczna',
      show_name_days: true,
    };
  }

  if (layout === 'planner') {
    exportDoc.planner = {
      type: page.strefaKalendarza.plannerTyp ?? 'planer-notatki',
      show_name_days: true,
    };
  }

  if (layout === 'radial') {
    exportDoc.radial_calendar = {
      center: page.strefaKalendarza.srodek,
      day_radius_mm: page.strefaKalendarza.promienDni,
      outer_radius_mm: page.strefaKalendarza.promienZewn,
    };
  }

  if (kalendarium.efekty?.zdjecia) {
    exportDoc.photo_effects = { filter: kalendarium.efekty.zdjecia };
  }

  return exportDoc;
}

export function exportThemeJsonString(kalendarium: Kalendarium, pageFormat: PageFormat = 'A4'): string {
  return JSON.stringify(exportThemeSchema(kalendarium, pageFormat), null, 2);
}
