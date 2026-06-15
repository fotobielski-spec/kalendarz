/**
 * 30 kalendarzy plakatowych — cały rok na 1 karcie A4 pion
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

function yearTitle(y, kolor, rozmiar = 14) {
  return {
    tytulRoczny: {
      x: M,
      y,
      szerokosc: W,
      wysokosc: 12,
      tekst: 'Kalendarz {rok}',
      rozmiar,
      wyrownanie: 'center',
      kolor,
      transform: 'uppercase',
      letterSpacing: 1.5,
    },
  };
}

/** Układy: foto + siatka 12 miesięcy na jednej stronie */
function layoutTop(photoPct, cols, rows, gap = 2) {
  const ph = Math.round(H * photoPct / 100);
  const titleH = 14;
  const gridY = M + titleH + ph + 2;
  const gridH = PAGE_H - M - gridY;
  return {
    proporcja: { zdjecie: photoPct, kalendarium: 100 - photoPct },
    ukladRoczny: `plak-top-${cols}x${rows}`,
    strefy: () => [zone('foto', 'hero', M, M + titleH, W, ph, { opis: 'Zdjęcie rodzinne / plakatowe' })],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, gap),
    typografia: yearTitle(M + 2, null),
    titleY: M + 2,
  };
}

function layoutBottom(photoPct, cols, rows, gap = 2) {
  const ph = Math.round(H * photoPct / 100);
  const titleH = 14;
  const gridY = M + titleH;
  const gridH = H - titleH - ph - 4;
  return {
    proporcja: { zdjecie: photoPct, kalendarium: 100 - photoPct },
    ukladRoczny: `plak-bottom-${cols}x${rows}`,
    strefy: () => [zone('foto', 'hero', M, gridY + gridH + 4, W, ph, { opis: 'Zdjęcie u dołu plakatu' })],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, gap),
    typografia: yearTitle(M + 2, null),
    titleY: M + 2,
  };
}

function layoutLeft(photoPct, cols, rows, gap = 2) {
  const pw = Math.round(W * photoPct / 100);
  const cw = W - pw - 3;
  const titleH = 14;
  return {
    proporcja: { zdjecie: photoPct, kalendarium: 100 - photoPct },
    ukladRoczny: `plak-left-${cols}x${rows}`,
    strefy: () => [zone('foto', 'kolumna', M, M + titleH, pw, H - titleH, { opis: 'Portret / zdjęcie pionowe' })],
    strefaKalendarza: calYear(M + pw + 3, M + titleH, cw, H - titleH, cols, rows, gap),
    typografia: yearTitle(M + 2, null),
    titleY: M + 2,
  };
}

function layoutRight(photoPct, cols, rows, gap = 2) {
  const pw = Math.round(W * photoPct / 100);
  const cw = W - pw - 3;
  const titleH = 14;
  return {
    proporcja: { zdjecie: photoPct, kalendarium: 100 - photoPct },
    ukladRoczny: `plak-right-${cols}x${rows}`,
    strefy: () => [zone('foto', 'kolumna', M + cw + 3, M + titleH, pw, H - titleH, { opis: 'Zdjęcie po prawej' })],
    strefaKalendarza: calYear(M, M + titleH, cw, H - titleH, cols, rows, gap),
    typografia: yearTitle(M + 2, null),
    titleY: M + 2,
  };
}

function layoutFull(cols, rows, gap = 2, titleH = 18) {
  const gridY = M + titleH;
  const gridH = H - titleH;
  return {
    proporcja: { zdjecie: 0, kalendarium: 100 },
    ukladRoczny: `plak-full-${cols}x${rows}`,
    strefy: () => [],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, gap),
    typografia: yearTitle(M + 4, null, 16),
    titleY: M + 4,
  };
}

function layoutStrip(stripH, cols, rows, position = 'top') {
  const titleH = 14;
  const gridH = H - titleH - stripH - 4;
  const gridY = position === 'top' ? M + titleH + stripH + 4 : M + titleH;
  const photoY = position === 'top' ? M + titleH : gridY + gridH + 4;
  return {
    proporcja: { zdjecie: Math.round((stripH / H) * 100), kalendarium: 100 - Math.round((stripH / H) * 100) },
    ukladRoczny: `plak-strip-${cols}x${rows}`,
    strefy: () => [zone('foto', 'panorama', M, photoY, W, stripH, { opis: 'Panorama / pasek zdjęcia' })],
    strefaKalendarza: calYear(M, gridY, W, gridH, cols, rows, 2),
    typografia: yearTitle(M + 2, null),
    titleY: M + 2,
  };
}

function buildYearPage(def, layout, paleta) {
  const titleColor = paleta.akcent;
  const typo = {
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
  };

  return {
    numer: 1,
    typ: 'rok',
    etykieta: 'Kalendarz roczny',
    uklad: layout.ukladRoczny,
    proporcja: layout.proporcja,
    strefyZdjec: layout.strefy(),
    strefaKalendarza: {
      ...layout.strefaKalendarza,
      ...(def.showImieniny === false ? { bezImienin: true } : {}),
      ...(def.compact ? { kompaktowy: true } : {}),
    },
    typografia: typo,
    dekoracje: def.dekoracje?.(layout, paleta) ?? [],
    efektyStrony: def.efektyStrony ?? null,
  };
}

function def(
  id, nazwa, kategoria, opis, tagi, paleta, typografia, layout, extras = {},
) {
  return {
    id,
    nazwa,
    kategoria,
    opis,
    tagi,
    paleta,
    typografia,
    ...extras,
    layout,
    strony: [buildYearPage(extras, layout, paleta)],
  };
}

const DEFINICJE = [
  def('PLAK-01', 'Rodzinny Klasyczny', 'rodzinne',
    'Zdjęcie u góry (38%), siatka 4×3 — klasyczny plakat roczny.',
    ['4x3', 'foto-gora', 'rodzinny'],
    { tlo: '#FFFBF5', akcent: '#8B7355', tekst: '#3D3429' },
    { naglowek: 'Georgia', tekst: 'system-ui', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutTop(38, 4, 3),
    { dekoracje: () => [{ typ: 'linia', x: M, y: M + 52, szerokosc: W, grubosc: 1, kolor: '#8B7355' }] },
  ),
  def('PLAK-02', 'Minimal Biały', 'minimal',
    'Pełna siatka 4×3 bez zdjęcia — czysty, minimalistyczny.',
    ['4x3', 'bez-foto', 'minimal'],
    { tlo: '#FFFFFF', akcent: '#111111', tekst: '#333333' },
    { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 3),
  ),
  def('PLAK-03', 'Noir Elegancki', 'elegancki',
    'Ciemne tło, złote akcenty, siatka 4×3 na pełnej karcie.',
    ['4x3', 'ciemny', 'elegancki'],
    { tlo: '#0F0F0F', akcent: '#D4AF37', tekst: '#F5F5F5' },
    { naglowek: 'Cinzel', tekst: 'Raleway', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 2),
    { titleTransform: 'uppercase', titleSpacing: 3 },
  ),
  def('PLAK-04', 'Portret Lewy', 'portret',
    'Zdjęcie pionowe po lewej (30%), miesiące 3×4 po prawej.',
    ['3x4', 'foto-lewo'],
    { tlo: '#FAF8F5', akcent: '#6B5344', tekst: '#2A2118' },
    { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(30, 3, 4),
  ),
  def('PLAK-05', 'Portret Prawy', 'portret',
    'Zdjęcie po prawej (30%), siatka 3×4 po lewej.',
    ['3x4', 'foto-prawo'],
    { tlo: '#F8FAFC', akcent: '#1E40AF', tekst: '#1E293B' },
    { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutRight(30, 3, 4),
  ),
  def('PLAK-06', 'Foto Dół', 'rodzinne',
    'Siatka 4×3 u góry, duże zdjęcie u dołu (35%).',
    ['4x3', 'foto-dol'],
    { tlo: '#FFF7ED', akcent: '#C2410C', tekst: '#431407' },
    { naglowek: 'Lora', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(35, 4, 3),
  ),
  def('PLAK-07', 'Pastelowy Dom', 'pastelowy',
    'Miękkie pastele, foto góra 42%, siatka 4×3.',
    ['4x3', 'pastel', 'foto-gora'],
    { tlo: '#FDF2F8', akcent: '#DB2777', tekst: '#831843' },
    { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(42, 4, 3, 3),
  ),
  def('PLAK-08', 'Nordycki Spokój', 'nordycki',
    'Pełna siatka 3×4 — skandynawski minimalizm bez zdjęcia.',
    ['3x4', 'nordycki', 'bez-foto'],
    { tlo: '#F0F4F8', akcent: '#2D3748', tekst: '#1A202C' },
    { naglowek: 'Josefin Sans', tekst: 'Work Sans', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutFull(3, 4, 4, 16),
    { titleAlign: 'left', titleTransform: 'none' },
  ),
  def('PLAK-09', 'Korporacyjny', 'biznes',
    'Niebieski biznesowy, foto góra 32%, siatka 4×3.',
    ['4x3', 'biznes', 'foto-gora'],
    { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A5F' },
    { naglowek: 'Roboto', tekst: 'Roboto', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutTop(32, 4, 3),
  ),
  def('PLAK-10', 'Vintage Sepia', 'vintage',
    'Pasek zdjęcia u góry, retro sepia, siatka 4×3.',
    ['4x3', 'vintage', 'pasek'],
    { tlo: '#F5F0E8', akcent: '#78350F', tekst: '#44403C' },
    { naglowek: 'EB Garamond', tekst: 'EB Garamond', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutStrip(48, 4, 3, 'top'),
    { efekty: { zdjecia: 'sepia' } },
  ),
  def('PLAK-11', 'Kolorowy Dziecięcy', 'dziecięcy',
    'Jaskrawe kolory, foto 40% góra, radosna siatka 4×3.',
    ['4x3', 'dzieci', 'kolorowy'],
    { tlo: '#FFFBEB', akcent: '#EA580C', tekst: '#1C1917', drugi: '#2563EB', trzeci: '#16A34A' },
    { naglowek: 'Fredoka', tekst: 'Nunito', rozmiarMiesiac: 7.5, rozmiarDzien: 5.5, roczny: true },
    layoutTop(40, 4, 3, 3),
  ),
  def('PLAK-12', 'Lux Złoto-Czarny', 'luksus',
    'Premium czarno-złoty, pełna siatka 4×3.',
    ['4x3', 'lux', 'zloto'],
    { tlo: '#0A0A0A', akcent: '#C9A227', tekst: '#FAFAFA' },
    { naglowek: 'Cinzel', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 2),
    { titleSpacing: 4 },
  ),
  def('PLAK-13', 'Dwie Kolumny', 'kompakt',
    '6 wierszy × 2 kolumny — wysokie komórki miesięcy.',
    ['2x6', 'bez-foto', 'wysoki'],
    { tlo: '#FFFFFF', akcent: '#0F766E', tekst: '#134E4A' },
    { naglowek: 'Libre Baskerville', tekst: 'Source Sans 3', rozmiarMiesiac: 8, rozmiarDzien: 6, roczny: true },
    layoutFull(2, 6, 3),
  ),
  def('PLAK-14', 'Sześć Rzędów', 'kompakt',
    '6×2 — szerokie mini-kalendarze w poziomie.',
    ['6x2', 'bez-foto'],
    { tlo: '#F8FAFC', akcent: '#475569', tekst: '#1E293B' },
    { naglowek: 'Archivo', tekst: 'Inter', rozmiarMiesiac: 6, rozmiarDzien: 4.5, roczny: true },
    layoutFull(6, 2, 2),
    { compact: true },
  ),
  def('PLAK-15', 'Okrągłe Foto', 'ozdobny',
    'Okrągłe zdjęcie w rogu, siatka 4×3.',
    ['4x3', 'okrag', 'foto-gora'],
    { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    { naglowek: 'Dancing Script', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    {
      ...layoutTop(35, 4, 3),
      strefy: () => [zone('foto', 'hero', M + W - 62, M + 16, 52, 52, {
        maska: 'okrag', opis: 'Okrągłe zdjęcie rodzinne',
      })],
    },
  ),
  def('PLAK-16', 'Gradient Niebo', 'nowoczesny',
    'Nowoczesny błękit, foto panorama 36%, 4×3.',
    ['4x3', 'nowoczesny', 'foto-gora'],
    { tlo: '#E0F2FE', akcent: '#0369A1', tekst: '#0C4A6E' },
    { naglowek: 'Poppins', tekst: 'Inter', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(36, 4, 3),
    { dekoracje: (_, p) => [{ typ: 'gradient-pas', x: M, y: M + 14, szerokosc: W, wysokosc: 4, od: p.akcent, do: p.tlo }] },
  ),
  def('PLAK-17', 'Ramka Ozdobna', 'klasyczny',
    'Podwójna ramka, pełna siatka 4×3.',
    ['4x3', 'ramka', 'ozdobny'],
    { tlo: '#FAFAF9', akcent: '#57534E', tekst: '#292524', ramka: '#A8A29E' },
    { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 3),
    { dekoracje: (l, p) => [
      { typ: 'ramka', x: M - 2, y: l.titleY - 4, szerokosc: W + 4, wysokosc: H - 10, kolor: p.ramka, grubosc: 1 },
      { typ: 'ramka', x: M + 2, y: l.titleY, szerokosc: W - 4, wysokosc: H - 18, kolor: p.akcent, grubosc: 0.5 },
    ] },
  ),
  def('PLAK-18', 'Ogrodniczy Zielony', 'natura',
    'Zielona natura, foto góra 34%, siatka 4×3.',
    ['4x3', 'natura', 'zielony'],
    { tlo: '#F0FDF4', akcent: '#15803D', tekst: '#14532D' },
    { naglowek: 'Merriweather', tekst: 'Open Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(34, 4, 3),
  ),
  def('PLAK-19', 'Boho Terakota', 'boho',
    'Ciepła terakota, foto lewo 28%, 3×4.',
    ['3x4', 'boho', 'foto-lewo'],
    { tlo: '#FEF3C7', akcent: '#B45309', tekst: '#78350F' },
    { naglowek: 'Libre Baskerville', tekst: 'Work Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(28, 3, 4, 3),
  ),
  def('PLAK-20', 'Monochrome', 'minimal',
    'Skala szarości, pełna siatka 4×3 bez zdjęcia.',
    ['4x3', 'monochrome', 'szary'],
    { tlo: '#F5F5F5', akcent: '#404040', tekst: '#171717' },
    { naglowek: 'Space Mono', tekst: 'Inter', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 2),
    { efekty: { zdjecia: 'grayscale' } },
  ),
  def('PLAK-21', 'Panorama Max', 'rodzinne',
    'Duże zdjęcie panoramiczne 45%, kompaktowa siatka 4×3.',
    ['4x3', 'panorama', 'foto-gora'],
    { tlo: '#FFFFFF', akcent: '#7C3AED', tekst: '#1E1B4B' },
    { naglowek: 'Outfit', tekst: 'DM Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 4.5, roczny: true },
    layoutTop(45, 4, 3, 2),
    { compact: true, showImieniny: false },
  ),
  def('PLAK-22', 'Kompakt Imieniny', 'kompakt',
    'Pełna siatka 4×3, mniejsze czcionki, bez imienin.',
    ['4x3', 'kompakt', 'bez-imienin'],
    { tlo: '#FAFAFA', akcent: '#525252', tekst: '#262626' },
    { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 6, rozmiarDzien: 4.5, roczny: true, dense: true },
    layoutFull(4, 3, 1.5),
    { compact: true, showImieniny: false },
  ),
  def('PLAK-23', 'Foto Pion 35%', 'portret',
    'Wysokie zdjęcie lewo 35%, siatka 3×4.',
    ['3x4', 'foto-lewo', 'portret'],
    { tlo: '#FFF7ED', akcent: '#9A3412', tekst: '#431407' },
    { naglowek: 'DM Serif Display', tekst: 'DM Sans', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutLeft(35, 3, 4),
  ),
  def('PLAK-24', 'Serif Centrum', 'elegancki',
    'Elegancki serif, tytuł wyśrodkowany, siatka 4×3.',
    ['4x3', 'serif', 'elegancki'],
    { tlo: '#FFFBEB', akcent: '#92400E', tekst: '#292524' },
    { naglowek: 'Cormorant Garamond', tekst: 'EB Garamond', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 3, 20),
    { titleSize: 18, titleAlign: 'center' },
  ),
  def('PLAK-25', 'Geometria Nowoczesna', 'nowoczesny',
    'Geometryczny nowoczesny, foto pasek 30%, 4×3.',
    ['4x3', 'geometria', 'nowoczesny'],
    { tlo: '#F1F5F9', akcent: '#0EA5E9', tekst: '#0F172A' },
    { naglowek: 'Archivo Black', tekst: 'Archivo', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutStrip(42, 4, 3, 'top'),
  ),
  def('PLAK-26', 'Świąteczny', 'sezonowy',
    'Czerwono-zielony świąteczny, foto góra 38%, 4×3.',
    ['4x3', 'swieta', 'sezonowy'],
    { tlo: '#FEF2F2', akcent: '#B91C1C', tekst: '#1F2937', drugi: '#15803D' },
    { naglowek: 'Mountains of Christmas', tekst: 'Nunito', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutTop(38, 4, 3),
  ),
  def('PLAK-27', 'Morski Błękit', 'natura',
    'Morski klimat, foto dół 33%, siatka 4×3.',
    ['4x3', 'morze', 'foto-dol'],
    { tlo: '#ECFEFF', akcent: '#0891B2', tekst: '#164E63' },
    { naglowek: 'Raleway', tekst: 'Open Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutBottom(33, 4, 3),
  ),
  def('PLAK-28', 'BW Panorama', 'fotografia',
    'Czarno-biały pasek panoramiczny, siatka 4×3.',
    ['4x3', 'bw', 'fotografia'],
    { tlo: '#FAFAFA', akcent: '#171717', tekst: '#404040' },
    { naglowek: 'Roboto Mono', tekst: 'Roboto', rozmiarMiesiac: 6.5, rozmiarDzien: 5, roczny: true },
    layoutStrip(50, 4, 3, 'top'),
    { efekty: { zdjecia: 'grayscale' } },
  ),
  def('PLAK-29', 'Art Deco', 'art-deco',
    'Styl art deco, pełna siatka 4×3, złoto na granacie.',
    ['4x3', 'art-deco', 'retro'],
    { tlo: '#1E1B4B', akcent: '#FCD34D', tekst: '#E0E7FF' },
    { naglowek: 'Poiret One', tekst: 'Josefin Sans', rozmiarMiesiac: 7, rozmiarDzien: 5, roczny: true },
    layoutFull(4, 3, 2),
    { titleSpacing: 5, dekoracje: (_, p) => [
      { typ: 'linia', x: M + 20, y: M + 16, szerokosc: W - 40, grubosc: 2, kolor: p.akcent },
    ] },
  ),
  def('PLAK-30', 'Premium Rodzinny', 'premium',
    'Premium plakat — foto 40% góra, siatka 4×3, ciepła paleta.',
    ['4x3', 'premium', 'rodzinny', 'foto-gora'],
    { tlo: '#FFFBF5', akcent: '#A16207', tekst: '#422006' },
    { naglowek: 'Fraunces', tekst: 'Source Sans 3', rozmiarMiesiac: 7, rozmiarDzien: 5.5, roczny: true },
    layoutTop(40, 4, 3, 3),
    { titleSize: 16, dekoracje: (_, p) => [
      { typ: 'linia', x: M, y: M + 54, szerokosc: W, grubosc: 1.5, kolor: p.akcent },
    ] },
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
  proporcja: d.layout.proporcja,
  orientacja: 'portrait',
  strony: d.strony,
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '30 kalendarzy plakatowych — cały rok na 1 karcie A4 pion',
  },
  formatWspolny: {
    nazwa: 'A4 pion — plakat 1 karta',
    szerokosc: PAGE_W,
    wysokosc: PAGE_H,
    orientacja: 'portrait',
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: { kalendarium: 65, zdjecie: 35 },
    imieniny: true,
    ukladRoczny: true,
    stronyNaKarte: 1,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2) + '\n');
console.log(`Zapisano ${kalendaria.length} plakatów → ${OUT}`);
