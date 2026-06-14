/**
 * 10 zróżnicowanych kalendarzy dla babci i dziadka
 * SEN-01…03: 48% kalendarz · SEN-04…10: 52% kalendarz (więcej miejsca na cyfry + imieniny)
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

const PROP_STD = { kalendarium: 48, zdjecie: 52 };
const PROP_CAL = { kalendarium: 52, zdjecie: 48 };

function makeZones(prop) {
  const ph = Math.round(H * prop.zdjecie / 100);
  const ch = H - ph;
  const pw = Math.round(W * prop.zdjecie / 100);
  const cw = W - pw;
  return {
    ph, ch, pw, cw, prop,
    CAL_BOTTOM: { x: M, y: M + ph, szerokosc: W, wysokosc: ch, uklad: 'senior' },
    CAL_TOP: { x: M, y: M, szerokosc: W, wysokosc: ch, uklad: 'senior' },
    CAL_LEFT: { x: M, y: M, szerokosc: cw, wysokosc: H, uklad: 'senior' },
    CAL_RIGHT: { x: M + pw, y: M, szerokosc: cw, wysokosc: H, uklad: 'senior' },
  };
}

const Z_STD = makeZones(PROP_STD);
const Z_CAL = makeZones(PROP_CAL);

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

function calTitle(cal, paleta, rozmiar = 18, opts = {}) {
  const sidebar = cal.szerokosc < 95;
  return {
    nazwaMiesiaca: {
      x: opts.left ? cal.x + 3 : cal.x + cal.szerokosc / 2,
      y: cal.y + (sidebar ? 4 : 2),
      rozmiar: sidebar ? Math.min(rozmiar, 13) : rozmiar,
      wyrownanie: opts.left ? 'left' : 'center',
      kolor: opts.kolor ?? paleta.akcent,
      waga: 'bold',
    },
  };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca, paleta, prop) {
  const cal = layout.strefaKalendarza;
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: prop,
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
    opis: 'Duże zdjęcie wnuków — czytelny kalendarz z imieninami u dołu.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#FFFBF5', akcent: '#9B2C2C', tekst: '#1A1A1A' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 15, rozmiarDzien: 14, senior: true },
    proporcja: PROP_STD,
    layout: {
      ukladMiesiac: 'senior-foto-top',
      titleRozmiar: 15,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 8, W, Z_STD.ph - 10, { opis: 'Zdjęcie wnuków lub rodziny' })],
      strefaKalendarza: Z_STD.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-02', nazwa: 'Mądry Dziadek', kategoria: 'dziadek',
    opis: 'Szeroki portret po lewej — kalendarz z imieninami po prawej.',
    tagi: ['senior', 'dziadek', 'portret'],
    paleta: { tlo: '#FFFFFF', akcent: '#1E3A8A', tekst: '#0F172A' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Source Sans 3', rozmiarMiesiac: 14, rozmiarDzien: 14, senior: true },
    proporcja: PROP_STD,
    layout: {
      ukladMiesiac: 'senior-foto-left',
      titleRozmiar: 14,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, Z_STD.pw, H, { opis: 'Portret dziadka lub rodzinne' })],
      strefaKalendarza: Z_STD.CAL_RIGHT,
    },
  },
  {
    id: 'SEN-03', nazwa: 'Rodzinne Wspomnienia', kategoria: 'rodzina',
    opis: 'Kalendarz po lewej, duże zdjęcie rodzinne po prawej.',
    tagi: ['senior', 'rodzina'],
    paleta: { tlo: '#F0FDF4', akcent: '#047857', tekst: '#064E3B' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Karla', rozmiarMiesiac: 14, rozmiarDzien: 14, senior: true },
    proporcja: PROP_STD,
    layout: {
      ukladMiesiac: 'senior-foto-right',
      titleRozmiar: 14,
      titleOpts: { left: true },
      strefyMiesiac: () => [zone('foto', 'kolumna', M + Z_STD.pw, M, Z_STD.pw, H, { opis: 'Rodzinne zdjęcie — uroczystość' })],
      strefaKalendarza: Z_STD.CAL_LEFT,
    },
  },
  {
    id: 'SEN-04', nazwa: 'Ogród Babci', kategoria: 'babcia',
    opis: 'Okrągłe zdjęcie ogrodu u góry — przestronny kalendarz z imieninami.',
    tagi: ['senior', 'babcia', 'ogród'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Fraunces', tekst: 'Nunito', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-kolo',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 34, M + 6, 118, 118, {
        opis: 'Kwiaty lub ogród babci',
        maska: 'okrag',
      })],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-05', nazwa: 'Fotel Dziadka', kategoria: 'dziadek',
    opis: 'Dwa polaroidy — spokojny układ z czytelnym kalendarzem.',
    tagi: ['senior', 'dziadek'],
    paleta: { tlo: '#FAF6F0', akcent: '#78350F', tekst: '#292524' },
    typografia: { naglowek: 'EB Garamond', tekst: 'Lexend', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-polaroid',
      titleRozmiar: 13,
      strefyMiesiac: () => [
        zone('foto', 'polaroid', M + 12, M + 10, 88, 98, {
          opis: 'Dziadek w fotelu lub hobby',
          obrot: -2,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 12 },
        }),
        zone('foto2', 'polaroid', M + 112, M + 14, 82, 92, {
          opis: 'Drugie zdjęcie — wspomnienie',
          obrot: 2,
          ramka: { szerokosc: 1, kolor: '#D6D3D1', marginesDolny: 10 },
        }),
      ],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-06', nazwa: 'Kontrast MAX', kategoria: 'kontrast',
    opis: 'Czarno-białe zdjęcie — maksymalna czytelność cyfr i imienin.',
    tagi: ['senior', 'kontrast', 'wcag'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Atkinson Hyperlegible', tekst: 'Roboto', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-kontrast',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 8, W, Z_CAL.ph - 10, { opis: 'Czarno-białe zdjęcie rodziny' })],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-07', nazwa: 'Żółto-Czarny', kategoria: 'kontrast',
    opis: 'Kalendarz u góry, zdjęcie u dołu — żółto-czarny kontrast.',
    tagi: ['senior', 'kontrast', 'widoczność'],
    paleta: { tlo: '#FEF9C3', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Lexend', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-kal-gora',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + Z_CAL.ch + 6, W, Z_CAL.ph - 8, { opis: 'Jasne, wyraziste zdjęcie rodziny' })],
      strefaKalendarza: Z_CAL.CAL_TOP,
    },
  },
  {
    id: 'SEN-08', nazwa: 'Spokojny Błękit', kategoria: 'babcia',
    opis: 'Duet zdjęć wnuków u góry — łagodny błękit, czytelny kalendarz.',
    tagi: ['senior', 'babcia', 'wnuki'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'DM Serif Display', tekst: 'Open Sans', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-duet',
      titleRozmiar: 13,
      strefyMiesiac: () => [
        zone('foto-a', 'kafelek', M, M + 8, 90, Z_CAL.ph - 12, { opis: 'Wnuk lub wnuczka — zdjęcie 1' }),
        zone('foto-b', 'kafelek', M + 96, M + 8, 90, Z_CAL.ph - 12, { opis: 'Wnuk lub wnuczka — zdjęcie 2' }),
      ],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-09', nazwa: 'Uśmiech Wnuków', kategoria: 'rodzina',
    opis: 'Łuk katedralny nad kalendarzem — dużo miejsca na zdjęcie wnuków.',
    tagi: ['senior', 'wnuki', 'prezent'],
    paleta: { tlo: '#FFF1F2', akcent: '#BE123C', tekst: '#4C0519' },
    typografia: { naglowek: 'Baloo 2', tekst: 'Lexend', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-luk',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'luk', M + 8, M + 4, 170, Z_CAL.ph - 8, {
        opis: 'Wnuki na zdjęciu — portret rodzinny',
        maska: 'luk',
      })],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
    },
  },
  {
    id: 'SEN-10', nazwa: 'Złota Jesień', kategoria: 'dziadek',
    opis: 'Jesienne zdjęcie — elegancki kalendarz z imieninami.',
    tagi: ['senior', 'dziadek', 'jesień'],
    paleta: { tlo: '#FFFBEB', akcent: '#B45309', tekst: '#451A03' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Spectral', rozmiarMiesiac: 13, rozmiarDzien: 12, senior: true, dense: true },
    proporcja: PROP_CAL,
    layout: {
      ukladMiesiac: 'senior-zlota-rama',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 8, W, Z_CAL.ph - 10, { opis: 'Jesienny krajobraz lub portret dziadka' })],
      strefaKalendarza: Z_CAL.CAL_BOTTOM,
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
  proporcja: def.proporcja,
  strony: MIESIACE.map((m, idx) => monthPage(def.layout, idx + 1, m, def.paleta, def.proporcja)),
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '10 kalendarzy senior — SEN-01…03: 48/52 · SEN-04…10: 52/48 (kalendarz/zdjęcie)',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: PROP_STD,
    imieniny: true,
    senior: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} kalendarzy senior → ${OUT}`);
