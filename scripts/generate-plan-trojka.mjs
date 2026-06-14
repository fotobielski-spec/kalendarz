/**
 * 10 zróżnicowanych kalendarzy „Trzy kalendarze”
 * Proporcja: 50% zdjęcie · 50% kalendarium
 * node scripts/generate-plan-trojka.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-trojka.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12, W = 186, H = 273;
const PROP = { kalendarium: 50, zdjecie: 50 };

function zones(prop) {
  const ph = Math.round(H * prop.zdjecie / 100);
  const ch = H - ph;
  const pw = Math.round(W * prop.zdjecie / 100);
  const cw = W - pw;
  return { ph, ch, pw, cw, prop };
}

const Z = zones(PROP);

function calTriple(pos, tripleTyp) {
  return { ...pos, uklad: 'trojka', tripleTyp };
}

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

function calTitle(cal, paleta, rozmiar = 13) {
  return {
    nazwaMiesiaca: {
      x: cal.x + cal.szerokosc / 2,
      y: cal.y + 2,
      rozmiar,
      wyrownanie: 'center',
      kolor: paleta.akcent,
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
    typografia: layout.typografiaMiesiac ?? calTitle(cal, paleta, layout.titleRozmiar ?? 13),
    dekoracje: layout.dekoracjeMiesiac?.() ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const DEFINICJE = [
  {
    id: 'TRZ-01', nazwa: 'Złoty Tryptyk', kategoria: 'klasyczny',
    opis: 'Panorama u góry (50%), trzy miesiące w rzędzie na dole — klasyczny tryptyk.',
    tagi: ['trojka', 'rząd', 'złoto'],
    paleta: { tlo: '#FFFBF5', akcent: '#B8860B', tekst: '#2C2416' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-panorama-rzad',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 4, W, Z.ph - 6, { opis: 'Szeroka panorama — krajobraz lub rodzina' })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-zlota-rzad'),
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M, y: M + Z.ph - 1, szerokosc: W, kolor: '#B8860B', grubosc: 2 }],
    },
  },
  {
    id: 'TRZ-02', nazwa: 'Vogue Filar', kategoria: 'editorial',
    opis: 'Portret lewa połowa (50%) — kalendarz prawa połowa: filar z trzema miesiącami.',
    tagi: ['trojka', 'filar', 'editorial'],
    paleta: { tlo: '#FFFFFF', akcent: '#1A1A2E', tekst: '#16213E' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 12, rozmiarDzien: 7.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-vogue-filar',
      titleRozmiar: 11,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, Z.pw, H, { opis: 'Portret na całą wysokość — styl Vogue' })],
      strefaKalendarza: calTriple({ x: M + Z.pw, y: M, szerokosc: Z.cw, wysokosc: H }, 'trojka-editorial-filar'),
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + Z.pw, y: M, wysokosc: H, kolor: '#1A1A2E', grubosc: 1.5 }],
    },
  },
  {
    id: 'TRZ-03', nazwa: 'Piramida Czasu', kategoria: 'romantyczny',
    opis: 'Łuk u góry (50%) — duży styczeń na górze kalendarza, grudzień i luty pod spodem.',
    tagi: ['trojka', 'piramida', 'łuk'],
    paleta: { tlo: '#FFF5F5', akcent: '#9F1239', tekst: '#4C0519' },
    typografia: { naglowek: 'Cormorant Infant', tekst: 'Nunito', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-luk-piramida',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'luk', M + 8, M + 2, 170, Z.ph - 4, { opis: 'Para lub rodzina w łuku', maska: 'luk' })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-romantyk-piramida'),
    },
  },
  {
    id: 'TRZ-04', nazwa: 'Nordycka Taśma', kategoria: 'minimal',
    opis: 'Kalendarz u góry (50%), zdjęcie u dołu (50%) — nordycka taśma trzech miesięcy.',
    tagi: ['trojka', 'taśma', 'nordycki'],
    paleta: { tlo: '#F8FAFC', akcent: '#334155', tekst: '#0F172A' },
    typografia: { naglowek: 'DM Sans', tekst: 'Inter', rozmiarMiesiac: 12, rozmiarDzien: 7.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-nord-tasma',
      titleRozmiar: 11,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + Z.ch + 4, W, Z.ph - 6, { opis: 'Minimalistyczne zdjęcie — natura lub wnętrze' })],
      strefaKalendarza: calTriple({ x: M, y: M, szerokosc: W, wysokosc: Z.ch }, 'trojka-nord-tasma'),
    },
  },
  {
    id: 'TRZ-05', nazwa: 'Art Deco Scena', kategoria: 'deco',
    opis: 'Portret w ramie deco u góry (50%) — piramida miesięcy na dole.',
    tagi: ['trojka', 'deco', 'piramida'],
    paleta: { tlo: '#FFFEF5', akcent: '#1C1917', tekst: '#1C1917' },
    typografia: { naglowek: 'Poiret One', tekst: 'Josefin Sans', rozmiarMiesiac: 13, rozmiarDzien: 7.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-deco-scena',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'hero', M + 14, M + 6, W - 28, Z.ph - 10, {
        opis: 'Portret glamour w ramie Art Deco',
        ramka: { szerokosc: 2, kolor: '#1C1917' },
      })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-deco-piramida'),
      dekoracjeMiesiac: () => [
        { typ: 'ramka', x: M + 6, y: M + 4, szerokosc: W - 12, wysokosc: Z.ph, kolor: '#1C1917', grubosc: 0.8 },
      ],
    },
  },
  {
    id: 'TRZ-06', nazwa: 'Pastelowe Rogi', kategoria: 'pastel',
    opis: 'Okrągłe zdjęcie u góry (50%) — grudzień i luty w rogach, styczeń na dole.',
    tagi: ['trojka', 'rogi', 'pastel'],
    paleta: { tlo: '#FDF4FF', akcent: '#C026D3', tekst: '#581C87' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 12, rozmiarDzien: 7.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-pastel-rogi',
      titleRozmiar: 11,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 48, M + 8, 90, 90, { opis: 'Delikatne zdjęcie w kole — kwiaty lub dziecko', maska: 'okrag' })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-pastel-rogi'),
    },
  },
  {
    id: 'TRZ-07', nazwa: 'Kinowy Noir', kategoria: 'nocny',
    opis: 'Zdjęcie u góry (50%), ciemny pasek kalendarza u dołu (50%) — klimat filmowy.',
    tagi: ['trojka', 'nakładka', 'noir'],
    paleta: { tlo: '#0F172A', akcent: '#E2E8F0', tekst: '#F1F5F9' },
    typografia: { naglowek: 'Bodoni Moda', tekst: 'Raleway', rozmiarMiesiac: 12, rozmiarDzien: 7.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-noir-nakladka',
      titleRozmiar: 11,
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, Z.ph, { opis: 'Portret lub miasto nocą — górna połowa' })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-noir-nakladka'),
    },
  },
  {
    id: 'TRZ-08', nazwa: 'Oś Botaniczna', kategoria: 'botaniczny',
    opis: 'Ogród u góry (50%) — pozioma taśma trzech miesięcy u dołu.',
    tagi: ['trojka', 'taśma', 'ogród'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Fraunces', tekst: 'Karla', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-botanic-tasma',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'hero', M + 16, M + 6, W - 32, Z.ph - 8, { opis: 'Ogród, kwiaty lub rośliny' })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-botanic-tasma'),
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + Z.ph + 1, szerokosc: W, kolor: '#166534', grubosc: 2.5 },
      ],
    },
  },
  {
    id: 'TRZ-09', nazwa: 'Blok Betonu', kategoria: 'brutalistyczny',
    opis: 'Ukośne zdjęcie u góry (50%) — bloki miesięcy na dole.',
    tagi: ['trojka', 'blok', 'brutalistyczny'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Roboto', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-brutalist-blok',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 4, W, Z.ph - 6, {
        opis: 'Beton, architektura lub abstrakcyjna tekstura',
        clipPath: 'polygon(0 0, 100% 0, 100% 82%, 0 100%)',
      })],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-brutalist-blok'),
    },
  },
  {
    id: 'TRZ-10', nazwa: 'Dwa Światy', kategoria: 'kolaż',
    opis: 'Dwa zdjęcia w górnej połowie (50%) — kalendarz w rzędzie na dole (50%).',
    tagi: ['trojka', 'kolaż', 'duet'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'DM Serif Display', tekst: 'Open Sans', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-duet-rzad',
      titleRozmiar: 12,
      strefyMiesiac: () => [
        zone('foto-a', 'kafelek', M, M + 4, 88, Z.ph - 8, { opis: 'Zdjęcie 1 — wspomnienie' }),
        zone('foto-b', 'kafelek', M + W - 88, M + 4, 88, Z.ph - 8, { opis: 'Zdjęcie 2 — przyszłość' }),
      ],
      strefaKalendarza: calTriple({ x: M, y: M + Z.ph, szerokosc: W, wysokosc: Z.ch }, 'trojka-duet-rzad'),
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M + 88, y: M + Z.ph - 1, szerokosc: W - 176, kolor: '#1D4ED8', grubosc: 0.5 },
      ],
    },
  },
];

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  kolekcja: 'trojka',
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
    opis: '10 kalendarzy „Trzy kalendarze” — 50/50 zdjęcie i kalendarium',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: PROP,
    imieniny: true,
    trojka: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} kalendarzy trojka → ${OUT}`);
