/**
 * 20 kalendarzy-planerów A4 pion 40/60
 * node scripts/generate-plan-planery.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-planery.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12, W = 186, H = 273;
const PH = Math.round(H * 0.6);
const CH = H - PH;
const PW = Math.round(W * 0.6);
const CW = W - PW;

const CAL_BOTTOM = { x: M, y: M + PH, szerokosc: W, wysokosc: CH };
const CAL_LEFT = { x: M, y: M, szerokosc: CW, wysokosc: H };
const CAL_RIGHT = { x: M + PW, y: M, szerokosc: CW, wysokosc: H };

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id, typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    ramka: opts.ramka ?? null,
    opis: opts.opis ?? '',
    wymagane: true,
  };
}

function calArea(pos, plannerTyp) {
  return { ...pos, uklad: 'planer', plannerTyp, kalendarium: true };
}

function calTitle(cal, paleta) {
  return {
    nazwaMiesiaca: {
      x: cal.x + 2,
      y: cal.y + 2,
      rozmiar: cal.szerokosc < 95 ? 10 : 12,
      kolor: paleta.akcent,
      wyrownanie: 'left',
    },
  };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca, paleta) {
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: { kalendarium: 40, zdjecie: 60 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: layout.strefaKalendarza,
    typografia: calTitle(layout.strefaKalendarza, paleta),
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
  };
}

const PLANER_TYPES = [
  'planer-tygodniowy', 'planer-nawyki', 'planer-cele', 'planer-kanban',
  'planer-czas', 'planer-finanse', 'planer-wellness', 'planer-notatki',
  'planer-priorytety', 'planer-menu', 'planer-trening', 'planer-czytanie',
  'planer-podroze', 'planer-urodziny', 'planer-rodzina', 'planer-projekt',
  'planer-gratitude', 'planer-zakupy', 'planer-kontakty', 'planer-nauka',
];

const LAYOUT_VARIANTS = [
  { uklad: 'planer-foto-top', cal: CAL_BOTTOM, foto: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie inspiracyjne' })] },
  { uklad: 'planer-foto-left', cal: CAL_RIGHT, foto: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Portret lub motyw' })] },
  { uklad: 'planer-foto-right', cal: CAL_LEFT, foto: () => [zone('foto', 'kolumna', M + CW, M, PW, H, { opis: 'Zdjęcie po prawej' })] },
];

const NAZWY = [
  'Tygodniowy Master', 'Tracker Nawyków', 'Cele Miesiąca', 'Tablica Kanban',
  'Plan Dnia', 'Budżet Domowy', 'Wellness & Zdrowie', 'Notatnik Dziennik',
  'Matryca Priorytetów', 'Plan Posiłków', 'Dziennik Treningu', 'Klub Książki',
  'Mapa Podróży', 'Kalendarz Urodzin', 'Rodzinny Organizer', 'Zarządzanie Projektem',
  'Dziennik Wdzięczności', 'Lista Zakupów', 'Książka Kontaktów', 'Plan Nauki',
];

const KATEGORIE = [
  'produktywność', 'nawyki', 'cele', 'praca', 'czas', 'finanse', 'wellness', 'notatki',
  'priorytety', 'kuchnia', 'sport', 'hobby', 'podróże', 'rodzina', 'rodzina', 'praca',
  'mindfulness', 'dom', 'kontakty', 'edukacja',
];

const PALETY = [
  { tlo: '#F8FAFC', akcent: '#0F766E', tekst: '#134E4A' },
  { tlo: '#FFF7ED', akcent: '#EA580C', tekst: '#431407' },
  { tlo: '#F0FDF4', akcent: '#15803D', tekst: '#14532D' },
  { tlo: '#EFF6FF', akcent: '#2563EB', tekst: '#1E3A8A' },
  { tlo: '#FAF5FF', akcent: '#7C3AED', tekst: '#3B0764' },
  { tlo: '#FEFCE8', akcent: '#CA8A04', tekst: '#422006' },
  { tlo: '#FFF1F2', akcent: '#E11D48', tekst: '#4C0519' },
  { tlo: '#F5F5F4', akcent: '#57534E', tekst: '#1C1917' },
  { tlo: '#ECFEFF', akcent: '#0891B2', tekst: '#164E63' },
  { tlo: '#FDF4FF', akcent: '#A21CAF', tekst: '#581C87' },
  { tlo: '#F0F9FF', akcent: '#0284C7', tekst: '#0C4A6E' },
  { tlo: '#FFFBEB', akcent: '#D97706', tekst: '#78350F' },
  { tlo: '#F0FDFA', akcent: '#0D9488', tekst: '#115E59' },
  { tlo: '#FFF5F5', akcent: '#DC2626', tekst: '#7F1D1D' },
  { tlo: '#F7FEE7', akcent: '#65A30D', tekst: '#365314' },
  { tlo: '#EEF2FF', akcent: '#4F46E5', tekst: '#312E81' },
  { tlo: '#FDF2F8', akcent: '#DB2777', tekst: '#831843' },
  { tlo: '#FEF9C3', akcent: '#A16207', tekst: '#713F12' },
  { tlo: '#ECFDF5', akcent: '#059669', tekst: '#064E3B' },
  { tlo: '#F1F5F9', akcent: '#475569', tekst: '#0F172A' },
];

const FONTS = [
  ['Inter', 'Inter'], ['Poppins', 'Open Sans'], ['Montserrat', 'Lato'],
  ['Raleway', 'Roboto'], ['Oswald', 'Source Sans 3'], ['Merriweather', 'Lato'],
  ['Josefin Sans', 'Nunito'], ['Bitter', 'Work Sans'], ['Archivo', 'DM Sans'],
  ['Quicksand', 'Nunito Sans'], ['Rubik', 'Karla'], ['Fira Sans', 'Fira Sans'],
  ['PT Sans', 'PT Serif'], ['Manrope', 'Manrope'], ['Space Grotesk', 'Space Mono'],
  ['Outfit', 'Outfit'], ['Sora', 'Sora'], ['Lexend', 'Lexend'], ['Plus Jakarta Sans', 'Plus Jakarta Sans'],
  ['Figtree', 'Figtree'],
];

const DEFINICJE = PLANER_TYPES.map((plannerTyp, i) => {
  const variant = LAYOUT_VARIANTS[i % LAYOUT_VARIANTS.length];
  const id = `PLAN-${String(i + 1).padStart(2, '0')}`;
  return {
    id,
    nazwa: NAZWY[i],
    kategoria: KATEGORIE[i],
    opis: `Planer z kalendarium (siatka + imieniny) i panelem: ${plannerTyp.replace('planer-', '').replace(/-/g, ' ')}.`,
    tagi: ['planer', plannerTyp.replace('planer-', '')],
    paleta: PALETY[i],
    typografia: { naglowek: FONTS[i][0], tekst: FONTS[i][1], rozmiarMiesiac: 11, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: variant.uklad,
      strefyMiesiac: variant.foto,
      strefaKalendarza: calArea(variant.cal, plannerTyp),
    },
  };
});

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  kolekcja: 'planery',
  opis: def.opis,
  tagi: def.tagi,
  paleta: def.paleta,
  typografia: def.typografia,
  proporcja: { kalendarium: 40, zdjecie: 60 },
  strony: MIESIACE.map((m, idx) => monthPage(def.layout, idx + 1, m, def.paleta)),
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '20 planerów A4 — kalendarium (siatka + imieniny) + panel planera · 40/60',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: { kalendarium: 40, zdjecie: 60 },
    imieniny: true,
    kalendarium: true,
    planery: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} planerów → ${OUT}`);
