/**
 * 30 kalendarzy plakatowych — cały rok na 1 karcie A4 pion
 * Proporcja stała: 50% zdjęcie · 50% kalendarium
 * node scripts/generate-plan-plakat.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-plakat.json');

const PAGE_W = 210;
const PAGE_H = 297;
const M = 10;
const W = PAGE_W - 2 * M;
const H = PAGE_H - 2 * M;

const PROP = { zdjecie: 50, kalendarium: 50 };
const TITLE_H = 12;
const CONTENT_H = H - TITLE_H;
const PH = Math.round(CONTENT_H * 0.5);
const CH = CONTENT_H - PH;
const PW = Math.round(W * 0.5);
const CW = W - PW - 3;

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id,
    typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    ramka: opts.ramka ?? null,
    clipPath: opts.clipPath ?? null,
    opis: opts.opis ?? '',
    wymagane: true,
    ...(opts.efekt ? { efekt: opts.efekt } : {}),
  };
}

function calYear(x, y, w, h, cols, rows, gap = 2, extra = {}) {
  return {
    x, y, szerokosc: w, wysokosc: h,
    uklad: 'roczny',
    siatkaKolumny: cols,
    siatkaWiersze: rows,
    odstepMm: gap,
    ...extra,
  };
}

/** Zdjęcie góra 50% · kalendarz dół 50% */
function layoutTop(cols, rows, gap = 2) {
  const gridY = M + TITLE_H + PH + 2;
  const gridH = PAGE_H - M - gridY;
  return {
    proporcja: PROP,
    ukladRoczny: `plak-top-50-${cols}x${rows}`,
    strefy: () => [zone('foto', 'hero', M, M + TITLE_H, W, PH, { opis: 'Zdjęcie klienta — górna połowa (50%)' })],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, gap),
    titleY: M + 2,
  };
}

/** Kalendarz góra 50% · zdjęcie dół 50% */
function layoutBottom(cols, rows, gap = 2) {
  const gridY = M + TITLE_H;
  const gridH = CH;
  const photoY = gridY + gridH + 2;
  return {
    proporcja: PROP,
    ukladRoczny: `plak-bottom-50-${cols}x${rows}`,
    strefy: () => [zone('foto', 'hero', M, photoY, W, PH, { opis: 'Zdjęcie klienta — dolna połowa (50%)' })],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, gap),
    titleY: M + 2,
  };
}

/** Zdjęcie lewo 50% · kalendarz prawo 50% */
function layoutLeft(cols, rows, gap = 2) {
  return {
    proporcja: PROP,
    ukladRoczny: `plak-left-50-${cols}x${rows}`,
    strefy: () => [zone('foto', 'kolumna', M, M + TITLE_H, PW, CONTENT_H, { opis: 'Zdjęcie klienta — lewa połowa (50%)' })],
    strefaKalendarza: calYear(M + PW + 3, M + TITLE_H, CW, CONTENT_H, cols, rows, gap),
    titleY: M + 2,
  };
}

/** Kalendarz lewo 50% · zdjęcie prawo 50% */
function layoutRight(cols, rows, gap = 2) {
  return {
    proporcja: PROP,
    ukladRoczny: `plak-right-50-${cols}x${rows}`,
    strefy: () => [zone('foto', 'kolumna', M + CW + 3, M + TITLE_H, PW, CONTENT_H, { opis: 'Zdjęcie klienta — prawa połowa (50%)' })],
    strefaKalendarza: calYear(M, M + TITLE_H, CW, CONTENT_H, cols, rows, gap),
    titleY: M + 2,
  };
}

function buildYearPage(def, layout, paleta) {
  const titleColor = paleta.akcent;
  return {
    numer: 1,
    typ: 'rok',
    etykieta: 'Kalendarz roczny',
    uklad: layout.ukladRoczny,
    proporcja: PROP,
    strefyZdjec: layout.strefy(),
    strefaKalendarza: {
      ...layout.strefaKalendarza,
      ...(def.showImieniny === false ? { bezImienin: true } : {}),
      ...(def.compact ? { kompaktowy: true } : {}),
    },
    typografia: {
      tytulRoczny: {
        x: M,
        y: layout.titleY,
        szerokosc: W,
        wysokosc: 12,
        tekst: 'Kalendarz {rok}',
        rozmiar: def.titleSize ?? 14,
        wyrownanie: def.titleAlign ?? 'center',
        kolor: titleColor,
        transform: def.titleTransform ?? 'uppercase',
        letterSpacing: def.titleSpacing ?? 1.5,
        waga: def.titleWeight ?? 'bold',
      },
    },
    dekoracje: def.dekoracje?.(layout, paleta) ?? [],
    efektyStrony: def.efektyStrony ?? null,
  };
}

function def(id, nazwa, kategoria, opis, tagi, paleta, typografia, layout, extras = {}) {
  return {
    id, nazwa, kategoria, opis, tagi, paleta, typografia, ...extras, layout,
    strony: [buildYearPage(extras, layout, paleta)],
  };
}

const splitLine = (y, kolor) => ({ typ: 'linia', x: M, y, szerokosc: W, grubosc: 1, kolor });

const DEFINICJE = [
  def('PLAK-01', 'Rodzinny Klasyczny', 'rodzinne',
    '50/50 — zdjęcie góra, siatka 4×3 dół. Klasyczny plakat roczny.',
    ['50-50', '4x3', 'foto-gora', 'rodzinny'],
    { tlo: '#FFFBF5', akcent: '#8B7355', tekst: '#3D3429' },
    { naglowek: 'Georgia', tekst: 'system-ui', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutTop(4, 3),
    { dekoracje: () => [splitLine(M + TITLE_H + PH, '#8B7355')] },
  ),
  def('PLAK-02', 'Minimal Biały', 'minimal',
    '50/50 — zdjęcie góra, czysta siatka 4×3 dół.',
    ['50-50', '4x3', 'minimal'],
    { tlo: '#FFFFFF', akcent: '#111111', tekst: '#333333' },
    { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3, 3),
  ),
  def('PLAK-03', 'Noir Elegancki', 'elegancki',
    '50/50 — zdjęcie góra, ciemna siatka 4×3 dół, złote akcenty.',
    ['50-50', '4x3', 'ciemny', 'elegancki'],
    { tlo: '#0F0F0F', akcent: '#D4AF37', tekst: '#F5F5F5' },
    { naglowek: 'Cinzel', tekst: 'Raleway', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3, 2),
    { titleTransform: 'uppercase', titleSpacing: 3 },
  ),
  def('PLAK-04', 'Portret Lewy', 'portret',
    '50/50 — zdjęcie lewa połowa, miesiące 3×4 prawo.',
    ['50-50', '3x4', 'foto-lewo'],
    { tlo: '#FAF8F5', akcent: '#6B5344', tekst: '#2A2118' },
    { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(3, 4),
  ),
  def('PLAK-05', 'Portret Prawy', 'portret',
    '50/50 — zdjęcie prawa połowa, siatka 3×4 lewo.',
    ['50-50', '3x4', 'foto-prawo'],
    { tlo: '#F8FAFC', akcent: '#1E40AF', tekst: '#1E293B' },
    { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutRight(3, 4),
  ),
  def('PLAK-06', 'Foto Dół', 'rodzinne',
    '50/50 — kalendarz 4×3 góra, zdjęcie dół.',
    ['50-50', '4x3', 'foto-dol'],
    { tlo: '#FFF7ED', akcent: '#C2410C', tekst: '#431407' },
    { naglowek: 'Lora', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3),
  ),
  def('PLAK-07', 'Pastelowy Dom', 'pastelowy',
    '50/50 — pastel, zdjęcie góra, siatka 4×3.',
    ['50-50', '4x3', 'pastel', 'foto-gora'],
    { tlo: '#FDF2F8', akcent: '#DB2777', tekst: '#831843' },
    { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3, 3),
  ),
  def('PLAK-08', 'Nordycki Spokój', 'nordycki',
    '50/50 — zdjęcie dół, skandynawska siatka 3×4 góra.',
    ['50-50', '3x4', 'nordycki'],
    { tlo: '#F0F4F8', akcent: '#2D3748', tekst: '#1A202C' },
    { naglowek: 'Josefin Sans', tekst: 'Work Sans', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutBottom(3, 4, 4),
    { titleAlign: 'left', titleTransform: 'none' },
  ),
  def('PLAK-09', 'Korporacyjny', 'biznes',
    '50/50 — niebieski biznes, foto góra, siatka 4×3.',
    ['50-50', '4x3', 'biznes', 'foto-gora'],
    { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A5F' },
    { naglowek: 'Roboto', tekst: 'Roboto', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
  ),
  def('PLAK-10', 'Vintage Sepia', 'vintage',
    '50/50 — zdjęcie góra (sepia), retro siatka 4×3 dół.',
    ['50-50', '4x3', 'vintage'],
    { tlo: '#F5F0E8', akcent: '#78350F', tekst: '#44403C' },
    { naglowek: 'EB Garamond', tekst: 'EB Garamond', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
    { efekty: { zdjecia: 'grayscale' } },
  ),
  def('PLAK-11', 'Kolorowy Dziecięcy', 'dziecięcy',
    '50/50 — jaskrawe kolory, foto góra, siatka 4×3.',
    ['50-50', '4x3', 'dzieci', 'kolorowy'],
    { tlo: '#FFFBEB', akcent: '#EA580C', tekst: '#1C1917', drugi: '#2563EB', trzeci: '#16A34A' },
    { naglowek: 'Fredoka', tekst: 'Nunito', rozmiarMiesiac: 7.5, rozmiarDzien: 5.5, roczny: true },
    layoutTop(4, 3, 3),
  ),
  def('PLAK-12', 'Lux Złoto-Czarny', 'luksus',
    '50/50 — zdjęcie góra, premium siatka 4×3 na czerni.',
    ['50-50', '4x3', 'lux', 'zloto'],
    { tlo: '#0A0A0A', akcent: '#C9A227', tekst: '#FAFAFA' },
    { naglowek: 'Cinzel', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3, 2),
    { titleSpacing: 4 },
  ),
  def('PLAK-13', 'Dwie Kolumny', 'kompakt',
    '50/50 — foto lewo, siatka 2×6 prawo.',
    ['50-50', '2x6', 'foto-lewo'],
    { tlo: '#FFFFFF', akcent: '#0F766E', tekst: '#134E4A' },
    { naglowek: 'Libre Baskerville', tekst: 'Source Sans 3', rozmiarMiesiac: 8, rozmiarDzien: 6, roczny: true },
    layoutLeft(2, 6, 3),
  ),
  def('PLAK-14', 'Sześć Rzędów', 'kompakt',
    '50/50 — foto prawo, kompaktowa siatka 6×2 lewo.',
    ['50-50', '6x2', 'foto-prawo'],
    { tlo: '#F8FAFC', akcent: '#475569', tekst: '#1E293B' },
    { naglowek: 'Archivo', tekst: 'Inter', rozmiarMiesiac: 6, rozmiarDzien: 4.5, roczny: true },
    layoutRight(6, 2, 2),
    { compact: true },
  ),
  def('PLAK-15', 'Okrągłe Foto', 'ozdobny',
    '50/50 — pełne zdjęcie góra z okrągłą maską, siatka 4×3 dół.',
    ['50-50', '4x3', 'okrag', 'foto-gora'],
    { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    { naglowek: 'Dancing Script', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    {
      ...layoutTop(4, 3),
      strefy: () => [zone('foto', 'hero', M, M + TITLE_H, W, PH, {
        maska: 'okrag', opis: 'Okrągłe zdjęcie — strefa 50% góra',
      })],
    },
  ),
  def('PLAK-16', 'Gradient Niebo', 'nowoczesny',
    '50/50 — błękit, panorama góra, siatka 4×3.',
    ['50-50', '4x3', 'nowoczesny'],
    { tlo: '#E0F2FE', akcent: '#0369A1', tekst: '#0C4A6E' },
    { naglowek: 'Poppins', tekst: 'Inter', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
    { dekoracje: (_, p) => [{ typ: 'gradient-pas', x: M, y: M + TITLE_H + PH - 4, szerokosc: W, wysokosc: 4, od: p.akcent, do: p.tlo }] },
  ),
  def('PLAK-17', 'Ramka Ozdobna', 'klasyczny',
    '50/50 — zdjęcie góra w ramce, siatka 4×3 dół.',
    ['50-50', '4x3', 'ramka'],
    { tlo: '#FAFAF9', akcent: '#57534E', tekst: '#292524', ramka: '#A8A29E' },
    { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3, 3),
    { dekoracje: (l, p) => [
      { typ: 'ramka', x: M - 2, y: l.titleY - 4, szerokosc: W + 4, wysokosc: H - 10, kolor: p.ramka, grubosc: 1 },
      { typ: 'ramka', x: M + 2, y: M + TITLE_H, szerokosc: W - 4, wysokosc: PH, kolor: p.akcent, grubosc: 0.5 },
    ] },
  ),
  def('PLAK-18', 'Ogrodniczy Zielony', 'natura',
    '50/50 — natura, foto góra, siatka 4×3.',
    ['50-50', '4x3', 'natura'],
    { tlo: '#F0FDF4', akcent: '#15803D', tekst: '#14532D' },
    { naglowek: 'Merriweather', tekst: 'Open Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
  ),
  def('PLAK-19', 'Boho Terakota', 'boho',
    '50/50 — terakota, foto lewo, siatka 3×4 prawo.',
    ['50-50', '3x4', 'boho', 'foto-lewo'],
    { tlo: '#FEF3C7', akcent: '#B45309', tekst: '#78350F' },
    { naglowek: 'Libre Baskerville', tekst: 'Work Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(3, 4, 3),
  ),
  def('PLAK-20', 'Monochrome', 'minimal',
    '50/50 — szarości, foto góra B&W, siatka 4×3.',
    ['50-50', '4x3', 'monochrome'],
    { tlo: '#F5F5F5', akcent: '#404040', tekst: '#171717' },
    { naglowek: 'Space Mono', tekst: 'Inter', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3, 2),
    { efekty: { zdjecia: 'grayscale' } },
  ),
  def('PLAK-21', 'Panorama Rodzinna', 'rodzinne',
    '50/50 — panoramiczne foto góra, kompaktowa siatka 4×3.',
    ['50-50', '4x3', 'panorama'],
    { tlo: '#FFFFFF', akcent: '#7C3AED', tekst: '#1E1B4B' },
    { naglowek: 'Outfit', tekst: 'DM Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 4.5, roczny: true },
    layoutTop(4, 3, 2),
    { compact: true, showImieniny: false },
  ),
  def('PLAK-22', 'Kompakt Kalendarz', 'kompakt',
    '50/50 — foto dół, gęsta siatka 4×3 góra.',
    ['50-50', '4x3', 'kompakt'],
    { tlo: '#FAFAFA', akcent: '#525252', tekst: '#262626' },
    { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 6, rozmiarDzien: 4.5, roczny: true, dense: true },
    layoutBottom(4, 3, 1.5),
    { compact: true, showImieniny: false },
  ),
  def('PLAK-23', 'Foto Pion Lewo', 'portret',
    '50/50 — portret lewo, siatka 3×4 prawo.',
    ['50-50', '3x4', 'foto-lewo', 'portret'],
    { tlo: '#FFF7ED', akcent: '#9A3412', tekst: '#431407' },
    { naglowek: 'DM Serif Display', tekst: 'DM Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(3, 4),
  ),
  def('PLAK-24', 'Serif Centrum', 'elegancki',
    '50/50 — elegancki serif, foto góra, siatka 4×3.',
    ['50-50', '4x3', 'serif'],
    { tlo: '#FFFBEB', akcent: '#92400E', tekst: '#292524' },
    { naglowek: 'Cormorant Garamond', tekst: 'EB Garamond', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3, 3),
    { titleSize: 18, titleAlign: 'center' },
  ),
  def('PLAK-25', 'Geometria Nowoczesna', 'nowoczesny',
    '50/50 — foto góra, geometryczna siatka 4×3.',
    ['50-50', '4x3', 'geometria'],
    { tlo: '#F1F5F9', akcent: '#0EA5E9', tekst: '#0F172A' },
    { naglowek: 'Archivo Black', tekst: 'Archivo', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
  ),
  def('PLAK-26', 'Świąteczny', 'sezonowy',
    '50/50 — świąteczny, foto góra, siatka 4×3.',
    ['50-50', '4x3', 'swieta'],
    { tlo: '#FEF2F2', akcent: '#B91C1C', tekst: '#1F2937', drugi: '#15803D' },
    { naglowek: 'Mountains of Christmas', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
  ),
  def('PLAK-27', 'Morski Błękit', 'natura',
    '50/50 — morze, kalendarz góra, foto dół.',
    ['50-50', '4x3', 'morze', 'foto-dol'],
    { tlo: '#ECFEFF', akcent: '#0891B2', tekst: '#164E63' },
    { naglowek: 'Raleway', tekst: 'Open Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3),
  ),
  def('PLAK-28', 'BW Panorama', 'fotografia',
    '50/50 — czarno-białe foto góra, siatka 4×3.',
    ['50-50', '4x3', 'bw', 'fotografia'],
    { tlo: '#FAFAFA', akcent: '#171717', tekst: '#404040' },
    { naglowek: 'Roboto Mono', tekst: 'Roboto', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutTop(4, 3),
    { efekty: { zdjecia: 'grayscale' } },
  ),
  def('PLAK-29', 'Art Deco', 'art-deco',
    '50/50 — art deco, foto góra, siatka 4×3 na granacie.',
    ['50-50', '4x3', 'art-deco'],
    { tlo: '#1E1B4B', akcent: '#FCD34D', tekst: '#E0E7FF' },
    { naglowek: 'Poiret One', tekst: 'Josefin Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(4, 3, 2),
    { titleSpacing: 5, dekoracje: (_, p) => [
      { typ: 'linia', x: M + 20, y: M + 16, szerokosc: W - 40, grubosc: 2, kolor: p.akcent },
    ] },
  ),
  def('PLAK-30', 'Premium Rodzinny', 'premium',
    '50/50 — premium plakat, foto góra, siatka 4×3, ciepła paleta.',
    ['50-50', '4x3', 'premium', 'rodzinny'],
    { tlo: '#FFFBF5', akcent: '#A16207', tekst: '#422006' },
    { naglowek: 'Fraunces', tekst: 'Source Sans 3', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutTop(4, 3, 3),
    { titleSize: 16, dekoracje: (_, p) => [splitLine(M + TITLE_H + PH, p.akcent)] },
  ),
];

const kalendaria = DEFINICJE.map((d) => ({
  id: d.id,
  nazwa: d.nazwa,
  kategoria: d.kategoria,
  kolekcja: 'plakat',
  opis: d.opis,
  tagi: d.tagi,
  paleta: d.paleta,
  typografia: d.typografia,
  efekty: d.efekty,
  proporcja: PROP,
  orientacja: 'portrait',
  strony: d.strony,
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '30 kalendarzy plakatowych 50/50 — cały rok na 1 karcie A4 pion',
  },
  formatWspolny: {
    nazwa: 'A4 pion — plakat 1 karta 50/50',
    szerokosc: PAGE_W,
    wysokosc: PAGE_H,
    orientacja: 'portrait',
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: PROP,
    imieniny: true,
    ukladRoczny: true,
    stronyNaKarte: 1,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2) + '\n');
console.log(`Zapisano ${kalendaria.length} plakatów 50/50 → ${OUT}`);
