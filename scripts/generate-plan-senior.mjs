/**
 * 10 zróżnicowanych kalendarzy dla babci i dziadka
 * Duże cyfry + imieniny · 40% kalendarium / 60% zdjęcie
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
const PH = Math.round(H * 0.60);  // 164 — strefa zdjęcia
const CH = H - PH;                // 109 — strefa kalendarza
const PW = Math.round(W * 0.60);  // 112 — zdjęcie w układzie poziomym
const CW = W - PW;                // 74  — kalendarz w układzie poziomym

const PROP = { kalendarium: 40, zdjecie: 60 };

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id, typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    ramka: opts.ramka ?? null,
    clipPath: opts.clipPath ?? null,
    opis: opts.opis ?? '',
    wymagane: opts.wymagane ?? true,
  };
}

function calSenior(pos) {
  return { ...pos, uklad: 'senior' };
}

const CAL_BOTTOM = calSenior({ x: M, y: M + PH, szerokosc: W, wysokosc: CH });
const CAL_TOP = calSenior({ x: M, y: M, szerokosc: W, wysokosc: CH });
const CAL_LEFT = calSenior({ x: M, y: M, szerokosc: CW, wysokosc: H });
const CAL_RIGHT = calSenior({ x: M + PW, y: M, szerokosc: CW, wysokosc: H });

function calTitle(cal, paleta, rozmiar = 18, opts = {}) {
  const sidebar = cal.szerokosc < 95;
  return {
    nazwaMiesiaca: {
      x: opts.left ? cal.x + 3 : cal.x + cal.szerokosc / 2,
      y: cal.y + (sidebar ? 4 : 2),
      rozmiar: sidebar ? Math.min(rozmiar, 14) : rozmiar,
      wyrownanie: opts.left ? 'left' : 'center',
      kolor: opts.kolor ?? paleta.akcent,
      waga: 'bold',
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
    proporcja: PROP,
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: cal,
    typografia: layout.typografiaMiesiac ?? calTitle(cal, paleta, layout.titleRozmiar, layout.titleOpts),
    dekoracje: [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const DEFINICJE = [
  {
    id: 'SEN-01', nazwa: 'Ciepła Babcia', kategoria: 'babcia',
    opis: 'Duże zdjęcie wnuków (60%) — czytelny kalendarz z imieninami u dołu.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#FFFBF5', akcent: '#9B2C2C', tekst: '#1A1A1A' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 8, W, PH - 10, { opis: 'Zdjęcie wnuków lub rodziny' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-02', nazwa: 'Mądry Dziadek', kategoria: 'dziadek',
    opis: 'Szeroki portret po lewej (60%) — kalendarz z imieninami po prawej.',
    tagi: ['senior', 'dziadek', 'portret'],
    paleta: { tlo: '#FFFFFF', akcent: '#1E3A8A', tekst: '#0F172A' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Source Sans 3', rozmiarMiesiac: 14, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-left',
      titleRozmiar: 14,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Portret dziadka lub rodzinne' })],
      strefaKalendarza: CAL_RIGHT,
    },
  },
  {
    id: 'SEN-03', nazwa: 'Rodzinne Wspomnienia', kategoria: 'rodzina',
    opis: 'Kalendarz po lewej, duże zdjęcie rodzinne po prawej (60%).',
    tagi: ['senior', 'rodzina'],
    paleta: { tlo: '#F0FDF4', akcent: '#047857', tekst: '#064E3B' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Karla', rozmiarMiesiac: 14, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-right',
      titleRozmiar: 14,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M + PW, M, PW, H, { opis: 'Rodzinne zdjęcie — uroczystość' })],
      strefaKalendarza: CAL_LEFT,
    },
  },
  {
    id: 'SEN-04', nazwa: 'Ogród Babci', kategoria: 'babcia',
    opis: 'Duże okrągłe zdjęcie ogrodu (60% góry) — kalendarz z imieninami pod spodem.',
    tagi: ['senior', 'babcia', 'ogród'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Fraunces', tekst: 'Nunito', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-kolo',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 22, M + 10, 142, 142, {
        opis: 'Kwiaty lub ogród babci',
        maska: 'okrag',
      })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-05', nazwa: 'Fotel Dziadka', kategoria: 'dziadek',
    opis: 'Dwa polaroidy na szerokiej strefie zdjęć — ciepły, spokojny układ.',
    tagi: ['senior', 'dziadek'],
    paleta: { tlo: '#FAF6F0', akcent: '#78350F', tekst: '#292524' },
    typografia: { naglowek: 'EB Garamond', tekst: 'Lexend', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-polaroid',
      titleRozmiar: 15,
      strefyMiesiac: () => [
        zone('foto', 'polaroid', M + 14, M + 12, 96, 108, {
          opis: 'Dziadek w fotelu lub hobby',
          obrot: -2,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 14 },
        }),
        zone('foto2', 'polaroid', M + 118, M + 18, 88, 100, {
          opis: 'Drugie zdjęcie — wspomnienie',
          obrot: 2,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 12 },
        }),
      ],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-06', nazwa: 'Kontrast MAX', kategoria: 'kontrast',
    opis: 'Duże czarno-białe zdjęcie (60%) — maksymalna czytelność cyfr i imienin.',
    tagi: ['senior', 'kontrast', 'wcag'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Roboto', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-kontrast',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 10, W, PH - 12, { opis: 'Czarno-białe zdjęcie rodziny' })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-07', nazwa: 'Żółto-Czarny', kategoria: 'kontrast',
    opis: 'Kalendarz u góry, duże zdjęcie u dołu (60%) — żółto-czarny kontrast.',
    tagi: ['senior', 'kontrast', 'widoczność'],
    paleta: { tlo: '#FEF9C3', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Lexend', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-kal-gora',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + CH + 6, W, PH - 8, { opis: 'Jasne, wyraziste zdjęcie rodziny' })],
      strefaKalendarza: CAL_TOP,
    },
  },
  {
    id: 'SEN-08', nazwa: 'Spokojny Błękit', kategoria: 'babcia',
    opis: 'Duet dużych zdjęć wnuków (60% góry) — łagodny błękit.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'DM Serif Display', tekst: 'Open Sans', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-duet',
      titleRozmiar: 15,
      strefyMiesiac: () => [
        zone('foto-a', 'kafelek', M, M + 10, 90, PH - 14, { opis: 'Wnuk lub wnuczka — zdjęcie 1' }),
        zone('foto-b', 'kafelek', M + 96, M + 10, 90, PH - 14, { opis: 'Wnuk lub wnuczka — zdjęcie 2' }),
      ],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-09', nazwa: 'Uśmiech Wnuków', kategoria: 'rodzina',
    opis: 'Szeroki łuk katedralny nad kalendarzem — dużo miejsca na zdjęcie wnuków.',
    tagi: ['senior', 'wnuki', 'prezent'],
    paleta: { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    typografia: { naglowek: 'Baloo 2', tekst: 'Lexend', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-luk',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'luk', M + 8, M + 6, 170, 148, {
        opis: 'Wnuki na zdjęciu — portret rodzinny',
        maska: 'luk',
      })],
      strefaKalendarza: CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-10', nazwa: 'Złota Jesień', kategoria: 'dziadek',
    opis: 'Szerokie jesienne zdjęcie (60%) — elegancki kalendarz z imieninami.',
    tagi: ['senior', 'dziadek', 'jesień'],
    paleta: { tlo: '#FFFBEB', akcent: '#B45309', tekst: '#451A03' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Spectral', rozmiarMiesiac: 16, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-zlota-rama',
      titleRozmiar: 16,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 10, W, PH - 12, { opis: 'Jesienny krajobraz lub portret dziadka' })],
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
  proporcja: PROP,
  strony: MIESIACE.map((m, idx) => monthPage(def.layout, idx + 1, m, def.paleta)),
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '10 kalendarzy senior — duże cyfry + imieniny · 40/60 (kalendarz/zdjęcie)',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: PROP,
    imieniny: true,
    senior: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} kalendarzy senior → ${OUT}`);
