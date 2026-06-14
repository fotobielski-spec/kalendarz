/**
 * 10 zróżnicowanych kalendarzy dla babci i dziadka
 * Duże cyfry + imieniny · 60% kalendarium / 40% zdjęcie
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
const PH = Math.round(H * 0.40);  // 109 — strefa zdjęcia
const CH = H - PH;                // 164 — strefa kalendarza
const PW = Math.round(W * 0.40); // 74 — zdjęcie w układzie poziomym
const CW = W - PW;                // 112 — kalendarz w układzie poziomym

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

function calTitle(cal, paleta, rozmiar = 20, opts = {}) {
  const sidebar = cal.szerokosc < 120;
  return {
    nazwaMiesiaca: {
      x: opts.left ? cal.x + 4 : cal.x + cal.szerokosc / 2,
      y: cal.y + (sidebar ? 6 : 3),
      rozmiar,
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
    proporcja: { kalendarium: 60, zdjecie: 40 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: cal,
    typografia: layout.typografiaMiesiac ?? calTitle(cal, paleta, layout.titleRozmiar, layout.titleOpts),
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const DEFINICJE = [
  {
    id: 'SEN-01', nazwa: 'Ciepła Babcia', kategoria: 'babcia',
    opis: 'Różowo-kremowa elegancja — zdjęcie wnuków u góry, duże cyfry z imieninami u dołu.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#FFFBF5', akcent: '#9B2C2C', tekst: '#1A1A1A', roz: '#FECDD3' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lexend', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 22,
      strefyMiesiac: () => [zone('foto', 'hero', M + 4, 22, W - 8, PH - 18, {
        opis: 'Zdjęcie wnuków lub rodziny',
        ramka: { szerokosc: 2, kolor: '#9B2C2C' },
      })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M + 20, y: M + PH - 2, szerokosc: W - 40, kolor: '#FECDD3', grubosc: 2 },
        { typ: 'linia', x: M + 20, y: M + PH, szerokosc: W - 40, kolor: '#9B2C2C', grubosc: 1 },
      ],
    },
  },
  {
    id: 'SEN-02', nazwa: 'Mądry Dziadek', kategoria: 'dziadek',
    opis: 'Portret po lewej, wysoki kalendarz z imieninami po prawej — granat na bieli.',
    tagi: ['senior', 'dziadek', 'portret'],
    paleta: { tlo: '#FFFFFF', akcent: '#1E3A8A', tekst: '#0F172A' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Atkinson Hyperlegible', rozmiarMiesiac: 18, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-left',
      titleRozmiar: 18,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, {
        opis: 'Portret dziadka lub rodzinne',
        ramka: { szerokosc: 2, kolor: '#1E3A8A' },
      })],
      strefaKalendarza: CAL_RIGHT,
      dekoracjeMiesiac: () => [
        { typ: 'linia-pionowa', x: M + PW, y: M, wysokosc: H, kolor: '#1E3A8A', grubosc: 2 },
      ],
    },
  },
  {
    id: 'SEN-03', nazwa: 'Rodzinne Wspomnienia', kategoria: 'rodzina',
    opis: 'Kalendarz po lewej, zdjęcie rodzinne po prawej — zielona, spokojna paleta.',
    tagi: ['senior', 'rodzina'],
    paleta: { tlo: '#F0FDF4', akcent: '#047857', tekst: '#064E3B' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Source Sans 3', rozmiarMiesiac: 18, rozmiarDzien: 14, senior: true },
    layout: {
      ukladMiesiac: 'senior-foto-right',
      titleRozmiar: 18,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M + PW, M, PW, H, { opis: 'Rodzinne zdjęcie — uroczystość' })],
      strefaKalendarza: CAL_LEFT,
      dekoracjeMiesiac: () => [
        { typ: 'linia-pionowa', x: M + CW, y: M, wysokosc: H, kolor: '#047857', grubosc: 2 },
      ],
    },
  },
  {
    id: 'SEN-04', nazwa: 'Ogród Babci', kategoria: 'babcia',
    opis: 'Okrągłe zdjęcie kwiatów lub ogrodu — duża siatka z imieninami pod spodem.',
    tagi: ['senior', 'babcia', 'ogród'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Nunito', tekst: 'Nunito', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-kolo',
      titleRozmiar: 22,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 38, M + 6, 110, 110, {
        opis: 'Kwiaty lub ogród babci',
        maska: 'okrag',
        ramka: { szerokosc: 4, kolor: '#166534' },
      })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'pierścienie', cx: 105, cy: M + 58, promienie: [58, 64], kolor: '#166534' },
      ],
    },
  },
  {
    id: 'SEN-05', nazwa: 'Fotel Dziadka', kategoria: 'dziadek',
    opis: 'Polaroid z hobby dziadka — ciepły brąz, duże cyfry i imieniny.',
    tagi: ['senior', 'dziadek'],
    paleta: { tlo: '#FAF6F0', akcent: '#78350F', tekst: '#292524' },
    typografia: { naglowek: 'Merriweather', tekst: 'Lexend', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-polaroid',
      titleRozmiar: 22,
      strefyMiesiac: () => [
        zone('foto', 'polaroid', M + 16, M + 10, 88, 96, {
          opis: 'Dziadek w fotelu lub hobby',
          obrot: -3,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 14 },
        }),
        zone('foto2', 'polaroid', M + 108, M + 18, 72, 80, {
          opis: 'Drugie zdjęcie — wspomnienie',
          obrot: 4,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 12 },
        }),
      ],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M + 30, y: M + PH - 4, szerokosc: W - 60, kolor: '#78350F', grubosc: 1 },
      ],
    },
  },
  {
    id: 'SEN-06', nazwa: 'Kontrast MAX', kategoria: 'kontrast',
    opis: 'Czarno-biały układ WCAG — najwyższa czytelność cyfr i imienin.',
    tagi: ['senior', 'kontrast', 'wcag'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Atkinson Hyperlegible', rozmiarMiesiac: 24, rozmiarDzien: 16, senior: true },
    layout: {
      ukladMiesiac: 'senior-kontrast',
      titleRozmiar: 24,
      strefyMiesiac: () => [zone('foto', 'hero', M + 6, M + 14, W - 12, PH - 20, {
        opis: 'Czarno-białe zdjęcie rodziny',
        ramka: { szerokosc: 4, kolor: '#000000' },
      })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + PH, szerokosc: W, kolor: '#000000', grubosc: 4 },
      ],
    },
  },
  {
    id: 'SEN-07', nazwa: 'Żółto-Czarny', kategoria: 'kontrast',
    opis: 'Kalendarz u góry (od razu widoczny!), zdjęcie u dołu — żółto-czarny kontrast.',
    tagi: ['senior', 'kontrast', 'widoczność'],
    paleta: { tlo: '#FEF9C3', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Lexend', tekst: 'Lexend', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-kal-gora',
      titleRozmiar: 22,
      strefyMiesiac: () => [zone('foto', 'hero', M + 4, M + CH + 10, W - 8, PH - 14, {
        opis: 'Jasne, wyraziste zdjęcie rodziny',
        ramka: { szerokosc: 3, kolor: '#000000' },
      })],
      strefaKalendarza: CAL_TOP,
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + CH, szerokosc: W, kolor: '#000000', grubosc: 3 },
      ],
    },
  },
  {
    id: 'SEN-08', nazwa: 'Spokojny Błękit', kategoria: 'babcia',
    opis: 'Duet zdjęć wnuków u góry — łagodny błękit, czytelna siatka z imieninami.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'Lexend', tekst: 'Open Sans', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-duet',
      titleRozmiar: 22,
      strefyMiesiac: () => [
        zone('foto-a', 'kafelek', M + 6, M + 14, 84, PH - 22, {
          opis: 'Wnuk lub wnuczka — zdjęcie 1',
          ramka: { szerokosc: 2, kolor: '#1D4ED8' },
        }),
        zone('foto-b', 'kafelek', M + 96, M + 14, 84, PH - 22, {
          opis: 'Wnuk lub wnuczka — zdjęcie 2',
          ramka: { szerokosc: 2, kolor: '#1D4ED8' },
        }),
      ],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'kropka', x: 105, y: M + PH - 6, rozmiar: 5, kolor: '#1D4ED8' },
      ],
    },
  },
  {
    id: 'SEN-09', nazwa: 'Uśmiech Wnuków', kategoria: 'rodzina',
    opis: 'Łuk katedralny nad kalendarzem — radosna paleta, duże cyfry z imieninami.',
    tagi: ['senior', 'wnuki', 'prezent'],
    paleta: { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    typografia: { naglowek: 'Fredoka', tekst: 'Lexend', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-luk',
      titleRozmiar: 22,
      strefyMiesiac: () => [zone('foto', 'luk', M + 20, M + 8, 146, 96, {
        opis: 'Wnuki na zdjęciu — portret rodzinny',
        maska: 'luk',
        ramka: { szerokosc: 2, kolor: '#BE123C' },
      })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M + 24, y: M + PH - 2, szerokosc: W - 48, kolor: '#BE123C', grubosc: 2 },
      ],
    },
  },
  {
    id: 'SEN-10', nazwa: 'Złota Jesień', kategoria: 'dziadek',
    opis: 'Jesienna elegancja ze złotą ramą — kalendarz z imieninami i ciepłym portretem.',
    tagi: ['senior', 'dziadek', 'jesień'],
    paleta: { tlo: '#FFFBEB', akcent: '#B45309', tekst: '#451A03', metal: '#D97706' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Lexend', rozmiarMiesiac: 22, rozmiarDzien: 15, senior: true },
    layout: {
      ukladMiesiac: 'senior-zlota-rama',
      titleRozmiar: 22,
      strefyMiesiac: () => [zone('foto', 'hero', M + 10, M + 16, W - 20, PH - 22, {
        opis: 'Jesienny krajobraz lub portret dziadka',
        ramka: { szerokosc: 3, kolor: '#D97706', podwojna: true },
      })],
      strefaKalendarza: CAL_BOTTOM,
      dekoracjeMiesiac: () => [
        { typ: 'linia-zlota', pozycja: { x: M + 8, y: M + PH - 3 }, szerokosc: W - 16 },
        { typ: 'linia', x: M + 8, y: M + PH + 1, szerokosc: W - 16, kolor: '#B45309', grubosc: 1 },
      ],
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
    opis: '10 zróżnicowanych kalendarzy senior — duże cyfry + imieniny · 60/40',
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
