/**
 * 10 kalendarzy dla babci i dziadka — bardzo duże, czytelne cyfry
 * node scripts/generate-plan-senior.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-senior.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12, W = 186, H = 273;
const PH = Math.round(H * 0.40);
const CH = H - PH;

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

function calSenior(pos) {
  return { ...pos, uklad: 'senior' };
}

function calTitle(cal, paleta, rozmiar = 24) {
  return {
    nazwaMiesiaca: {
      x: cal.x + cal.szerokosc / 2,
      y: cal.y + 4,
      rozmiar,
      wyrownanie: 'center',
      kolor: paleta.akcent,
      waga: 'bold',
      transform: 'uppercase',
    },
  };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca, paleta) {
  const cal = layout.strefaKalendarza;
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: { kalendarium: 60, zdjecie: 40 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: cal,
    typografia: layout.typografiaMiesiac ?? calTitle(cal, paleta, layout.titleRozmiar),
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
  };
}

const CAL_BOTTOM = calSenior({ x: M, y: M + PH, szerokosc: W, wysokosc: CH });

const DEFINICJE = [
  {
    id: 'SEN-01', nazwa: 'Ciepła Babcia', kategoria: 'babcia',
    opis: 'Duże cyfry, wysoki kontrast — zdjęcie wnuków u góry, kalendarz 60% dołu.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#FFFBF5', akcent: '#9B2C2C', tekst: '#1A1A1A' },
    typografia: { naglowek: 'Lexend', tekst: 'Lexend', rozmiarMiesiac: 26, rozmiarDzien: 18, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 26,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Zdjęcie wnuków lub rodziny' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-02', nazwa: 'Mądry Dziadek', kategoria: 'dziadek',
    opis: 'Granat na bieli — maksymalna czytelność numerów dni dla dziadka.',
    tagi: ['senior', 'dziadek', 'kontrast'],
    paleta: { tlo: '#FFFFFF', akcent: '#1E3A8A', tekst: '#0F172A' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Atkinson Hyperlegible', rozmiarMiesiac: 28, rozmiarDzien: 20, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 28,
      strefyMiesiac: () => [zone('foto', 'hero', M, 18, W, PH - 10, { opis: 'Portret dziadka lub rodzinne' })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M, y: M + PH, szerokosc: W, kolor: '#1E3A8A', grubosc: 3 }],
    },
  },
  {
    id: 'SEN-03', nazwa: 'Rodzinne Wspomnienia', kategoria: 'rodzina',
    opis: 'Kalendarz z bardzo dużymi cyframi — idealny prezent dla babci i dziadka.',
    tagi: ['senior', 'rodzina'],
    paleta: { tlo: '#F8FAFC', akcent: '#047857', tekst: '#064E3B' },
    typografia: { naglowek: 'Lexend', tekst: 'Source Sans 3', rozmiarMiesiac: 24, rozmiarDzien: 17, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 24,
      strefyMiesiac: () => [zone('foto', 'hero', M, 22, W, PH - 14, { opis: 'Rodzinne zdjęcie — uroczystość' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-04', nazwa: 'Ogród Babci', kategoria: 'babcia',
    opis: 'Zielona paleta, ogromne numery dni — kwiaty lub ogród na zdjęciu.',
    tagi: ['senior', 'babcia', 'ogród'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Nunito', tekst: 'Nunito', rozmiarMiesiac: 26, rozmiarDzien: 18, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 26,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Kwiaty lub ogród babci' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-05', nazwa: 'Fotel Dziadka', kategoria: 'dziadek',
    opis: 'Ciepły brąz i krem — duże cyfry, spokojna typografia.',
    tagi: ['senior', 'dziadek'],
    paleta: { tlo: '#FAF6F0', akcent: '#78350F', tekst: '#292524' },
    typografia: { naglowek: 'Merriweather', tekst: 'Lexend', rozmiarMiesiac: 24, rozmiarDzien: 17, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 24,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Dziadek w fotelu lub hobby' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-06', nazwa: 'Kontrast MAX', kategoria: 'kontrast',
    opis: 'Czarno-biały układ — najwyższa czytelność cyfr dla słabowidzących.',
    tagi: ['senior', 'kontrast', 'wcag'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Atkinson Hyperlegible', rozmiarMiesiac: 30, rozmiarDzien: 22, senior: true },
    layout: {
      ukladMiesiac: 'senior-kontrast',
      titleRozmiar: 30,
      strefyMiesiac: () => [zone('foto', 'hero', M, 18, W, PH - 10, {
        opis: 'Czarno-białe zdjęcie rodziny',
        ramka: { szerokosc: 3, kolor: '#000000' },
      })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-07', nazwa: 'Żółto-Czarny', kategoria: 'kontrast',
    opis: 'Żółte tło, czarne cyfry — sprawdzony układ dla słabszego wzroku.',
    tagi: ['senior', 'kontrast', 'widoczność'],
    paleta: { tlo: '#FEF9C3', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Lexend', tekst: 'Lexend', rozmiarMiesiac: 28, rozmiarDzien: 20, senior: true },
    layout: {
      ukladMiesiac: 'senior-zolty',
      titleRozmiar: 28,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Jasne, wyraziste zdjęcie' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-08', nazwa: 'Spokojny Błękit', kategoria: 'babcia',
    opis: 'Duże cyfry na jasnoniebieskim tle — łagodny dla oczu.',
    tagi: ['senior', 'babcia'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'Lexend', tekst: 'Open Sans', rozmiarMiesiac: 26, rozmiarDzien: 18, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 26,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Babcia — portret lub hobby' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-09', nazwa: 'Uśmiech Wnuków', kategoria: 'rodzina',
    opis: 'Radosne kolory, ogromne numery — prezent od wnucząt.',
    tagi: ['senior', 'wnuki', 'prezent'],
    paleta: { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    typografia: { naglowek: 'Fredoka', tekst: 'Lexend', rozmiarMiesiac: 26, rozmiarDzien: 18, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 26,
      strefyMiesiac: () => [zone('foto', 'hero', M, 18, W, PH - 10, { opis: 'Wnuki na zdjęciu' })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [{ typ: 'kropka', x: M + 8, y: M + PH + 4, rozmiar: 4, kolor: '#BE123C' }],
    },
  },
  {
    id: 'SEN-10', nazwa: 'Złota Jesień', kategoria: 'dziadek',
    opis: 'Jesienna paleta — duże cyfry i imieniny dla babci lub dziadka.',
    tagi: ['senior', 'dziadek', 'jesień'],
    paleta: { tlo: '#FFFBEB', akcent: '#B45309', tekst: '#451A03' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Lexend', rozmiarMiesiac: 24, rozmiarDzien: 17, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 24,
      strefyMiesiac: () => [zone('foto', 'hero', M, 20, W, PH - 12, { opis: 'Jesienny krajobraz lub portret' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
];

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  kolekcja: 'senior',
  opis: def.opis,
  tagi: def.tagi,
  paleta: def.paleta,
  typografia: def.typografia,
  proporcja: { kalendarium: 60, zdjecie: 40 },
  strony: MIESIACE.map((m, idx) => monthPage(def.layout, idx + 1, m, def.paleta)),
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '10 kalendarzy senior — babcia i dziadek, bardzo duże czytelne cyfry · 60/40',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: { kalendarium: 60, zdjecie: 40 },
    imieniny: true,
    senior: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} kalendarzy senior → ${OUT}`);
