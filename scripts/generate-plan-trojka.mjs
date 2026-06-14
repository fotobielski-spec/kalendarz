/**
 * 10 kalendarzy „Trzy kalendarze” — główny miesiąc z imieninami + poprzedni i następny
 * 58% kalendarium · 42% zdjęcie
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
const PROP = { kalendarium: 58, zdjecie: 42 };
const PH = Math.round(H * PROP.zdjecie / 100);
const CH = H - PH;
const PW = Math.round(W * PROP.zdjecie / 100);
const CW = W - PW;

function calTriple(pos, tripleTyp) {
  return { ...pos, uklad: 'trojka', tripleTyp };
}

const CAL_BOTTOM = calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-klasyczna');
const CAL_TOP = calTriple({ x: M, y: M, szerokosc: W, wysokosc: CH }, 'trojka-nord');
const CAL_LEFT = calTriple({ x: M + PW, y: M, szerokosc: CW, wysokosc: H }, 'trojka-editorial');
const CAL_RIGHT = calTriple({ x: M, y: M, szerokosc: CW, wysokosc: H }, 'trojka-editorial');

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

function calTitle(cal, paleta, rozmiar = 14) {
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
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const DEFINICJE = [
  {
    id: 'TRZ-01', nazwa: 'Harmonia Trzech', kategoria: 'klasyczny',
    opis: 'Złota godzina u góry — trzy miesiące w harmonijnym tryptyku, środek z imieninami.',
    tagi: ['trojka', 'klasyczny', 'ciepły'],
    paleta: { tlo: '#FFFBF5', akcent: '#B8860B', tekst: '#2C2416' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 14, rozmiarDzien: 8.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-foto-top',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 6, W, PH - 8, { opis: 'Portret lub pejzaż — złota godzina' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-klasyczna'),
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M, y: M + PH - 1, szerokosc: W, kolor: '#B8860B', grubosc: 1.5 }],
    },
  },
  {
    id: 'TRZ-02', nazwa: 'Editorial Vogue', kategoria: 'editorial',
    opis: 'Magazynowy układ — zdjęcie po lewej, trzy kalendarze po prawej jak spread Vogue.',
    tagi: ['trojka', 'editorial'],
    paleta: { tlo: '#FAFAFA', akcent: '#1A1A2E', tekst: '#16213E' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-foto-left',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Portret editorial — lewa strona' })],
      strefaKalendarza: calTriple({ x: M + PW, y: M, szerokosc: CW, wysokosc: H }, 'trojka-editorial'),
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + PW, y: M, wysokosc: H, kolor: '#1A1A2E', grubosc: 1 }],
    },
  },
  {
    id: 'TRZ-03', nazwa: 'Most Czasu', kategoria: 'romantyczny',
    opis: 'Łuk katedralny nad kalendarzem — środkowy miesiąc unosi się jak most między przeszłością a przyszłością.',
    tagi: ['trojka', 'łuk', 'romantyczny'],
    paleta: { tlo: '#FFF5F5', akcent: '#9F1239', tekst: '#4C0519' },
    typografia: { naglowek: 'Cormorant Infant', tekst: 'Nunito', rozmiarMiesiac: 14, rozmiarDzien: 8.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-luk',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'luk', M + 10, M + 4, 166, PH - 6, { opis: 'Para lub rodzina w łuku', maska: 'luk' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-most'),
    },
  },
  {
    id: 'TRZ-04', nazwa: 'Nordycki Spokój', kategoria: 'minimal',
    opis: 'Kalendarze u góry, zdjęcie u dołu — skandynawski minimalizm, dużo oddechu.',
    tagi: ['trojka', 'nordycki', 'minimal'],
    paleta: { tlo: '#F8FAFC', akcent: '#334155', tekst: '#0F172A' },
    typografia: { naglowek: 'DM Sans', tekst: 'Inter', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-kal-gora',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + CH + 6, W, PH - 6, { opis: 'Minimalistyczne zdjęcie — natura lub wnętrze' })],
      strefaKalendarza: calTriple({ x: M, y: M, szerokosc: W, wysokosc: CH }, 'trojka-nord'),
    },
  },
  {
    id: 'TRZ-05', nazwa: 'Art Deco Gala', kategoria: 'deco',
    opis: 'Geometryczna elegancja lat 20. — czarno-złote narożniki, trzy miesiące w ramie deco.',
    tagi: ['trojka', 'art-deco', 'elegancki'],
    paleta: { tlo: '#FFFEF5', akcent: '#1C1917', tekst: '#1C1917' },
    typografia: { naglowek: 'Poiret One', tekst: 'Josefin Sans', rozmiarMiesiac: 14, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-deco',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M + 8, M + 8, W - 16, PH - 14, {
        opis: 'Portret glamour — styl lat 20.',
        ramka: { szerokosc: 2, kolor: '#1C1917', marginesDolny: 0 },
      })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-deco'),
      dekoracjeMiesiac: () => [
        { typ: 'ramka', x: M + 4, y: M + 4, szerokosc: W - 8, wysokosc: PH - 4, kolor: '#1C1917', grubosc: 1 },
      ],
    },
  },
  {
    id: 'TRZ-06', nazwa: 'Pastelowy Sen', kategoria: 'pastel',
    opis: 'Miękkie pastele i zaokrąglone panele — jak akwarela, delikatny tryptyk miesięcy.',
    tagi: ['trojka', 'pastel', 'akwarela'],
    paleta: { tlo: '#FDF4FF', akcent: '#C026D3', tekst: '#581C87' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-pastel',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 38, M + 6, 110, 110, { opis: 'Delikatne zdjęcie — kwiaty lub dziecko', maska: 'okrag' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-pastel'),
    },
  },
  {
    id: 'TRZ-07', nazwa: 'Galeria Noir', kategoria: 'nocny',
    opis: 'Filmowy kontrast — ciemne boczne miesiące, jasny środek z imieninami jak reflektor na scenie.',
    tagi: ['trojka', 'noir', 'kontrast'],
    paleta: { tlo: '#0F172A', akcent: '#E2E8F0', tekst: '#F1F5F9' },
    typografia: { naglowek: 'Bodoni Moda', tekst: 'Raleway', rozmiarMiesiac: 13, rozmiarDzien: 8, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-noir',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 4, W, PH - 6, { opis: 'Czarno-białe zdjęcie — portret lub miasto nocą' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-noir'),
      efektyStrony: { panelPolprzezroczysty: true },
    },
  },
  {
    id: 'TRZ-08', nazwa: 'Ogród Botaniczny', kategoria: 'botaniczny',
    opis: 'Zielone akcenty i botaniczna finezja — wieniec zdjęcia, trzy miesiące jak podział pór roku.',
    tagi: ['trojka', 'ogród', 'botaniczny'],
    paleta: { tlo: '#F0FDF4', akcent: '#166534', tekst: '#14532D' },
    typografia: { naglowek: 'Fraunces', tekst: 'Karla', rozmiarMiesiac: 14, rozmiarDzien: 8.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-botanic',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M + 20, M + 8, 146, PH - 12, { opis: 'Kwiaty, ogród lub rośliny doniczkowe' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-botanic'),
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M + 20, y: M + PH - 2, szerokosc: 146, kolor: '#166534', grubosc: 2 },
      ],
    },
  },
  {
    id: 'TRZ-09', nazwa: 'Brutalist Bold', kategoria: 'brutalistyczny',
    opis: 'Surowa typografia, grube linie — odważny brutalizm w służbie czytelności trzech miesięcy.',
    tagi: ['trojka', 'brutalistyczny', 'bold'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Roboto', rozmiarMiesiac: 14, rozmiarDzien: 8.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-brutalist',
      titleRozmiar: 14,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 6, W, PH - 10, {
        opis: 'Architektura betonowa lub abstrakcyjna tekstura',
        clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)',
      })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-brutalist'),
    },
  },
  {
    id: 'TRZ-10', nazwa: 'Złota Linia', kategoria: 'luksus',
    opis: 'Imperialna elegancja — złote linie, szlachetna typografia, trzy miesiące jak trzy rozdziały roku.',
    tagi: ['trojka', 'złoto', 'luksus'],
    paleta: { tlo: '#FFFBEB', akcent: '#B45309', tekst: '#451A03' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Spectral', rozmiarMiesiac: 14, rozmiarDzien: 8.5, trojka: true },
    layout: {
      ukladMiesiac: 'trojka-zlota',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'luk', M + 6, M + 4, 174, PH - 4, { opis: 'Elegancki portret lub krajobraz jesienny', maska: 'luk' })],
      strefaKalendarza: calTriple({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, 'trojka-zlota'),
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + PH + 2, szerokosc: W, kolor: '#B45309', grubosc: 0.8 },
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
    opis: '10 kalendarzy „Trzy kalendarze” — główny miesiąc z imieninami + poprzedni i następny',
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
