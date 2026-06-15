/**
 * 19 kalendarzy tematycznych 40/60 — koty, psy, OSP i więcej
 * node scripts/generate-plan-tematyczne.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-tematyczne.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12, W = 186, H = 273;
const PH = Math.round(H * 0.6);
const CH = H - PH;
const PW = Math.round(W * 0.6);
const CW = W - PW;

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id, typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    ramka: opts.ramka ?? null,
    clipPath: opts.clipPath ?? null,
    opis: opts.opis ?? '',
    wymagane: true,
    minDpi: 300,
  };
}

function calTitle(cal, opts = {}) {
  return {
    nazwaMiesiaca: {
      x: opts.center ? cal.x + cal.szerokosc / 2 : cal.x + 2,
      y: cal.y + 2,
      rozmiar: opts.rozmiar ?? 14,
      wyrownanie: opts.center ? 'center' : 'left',
      kolor: opts.kolor,
      transform: opts.uppercase ? 'uppercase' : undefined,
      letterSpacing: opts.letterSpacing,
      waga: opts.waga,
    },
  };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca) {
  const cal = layout.strefaKalendarza;
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: { kalendarium: 40, zdjecie: 60 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: cal,
    typografia: layout.typografiaMiesiac ?? calTitle(cal, layout.titleOpts),
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const CAL_BOTTOM = { x: M, y: M + PH, szerokosc: W, wysokosc: CH };
const CAL_LEFT = { x: M, y: M, szerokosc: CW, wysokosc: H };
const CAL_RIGHT = { x: M + PW, y: M, szerokosc: CW, wysokosc: H };

const DEFINICJE = [
  {
    id: 'TEM-01', nazwa: 'Mruczące Koty', kategoria: 'koty',
    opis: 'Kalendarz dla miłośników kotów — ciepłe ujęcia, pomarańczowa paleta.',
    tagi: ['koty', 'zwierzęta'],
    paleta: { tlo: '#FFF8F0', akcent: '#E67E22', tekst: '#4A3728' },
    typografia: { naglowek: 'Fredoka', tekst: 'Nunito', rozmiarMiesiac: 14, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'tem-koty-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie kota klienta' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#E67E22', rozmiar: 14 },
      dekoracjeMiesiac: () => [{ typ: 'kropka', x: M + 4, y: M + PH + 2, rozmiar: 3, kolor: '#E67E22' }],
    },
  },
  {
    id: 'TEM-02', nazwa: 'Wierne Psy', kategoria: 'psy',
    opis: 'Kalendarz psiarza — zdjęcie psa po lewej, kalendarz z imieninami po prawej.',
    tagi: ['psy', 'zwierzęta'],
    paleta: { tlo: '#F0F4F8', akcent: '#2E6DA4', tekst: '#1A2E44' },
    typografia: { naglowek: 'Baloo 2', tekst: 'Open Sans', rozmiarMiesiac: 12, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'tem-psy-left',
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Portret psa klienta' })],
      strefaKalendarza: CAL_RIGHT,
      titleOpts: { kolor: '#2E6DA4', rozmiar: 12 },
    },
  },
  {
    id: 'TEM-03', nazwa: 'OSP Bohaterowie', kategoria: 'osp',
    opis: 'Kalendarz strażacki OSP — czerwono-złota paleta, zdjęcie jednostki lub zespołu.',
    tagi: ['osp', 'straż', 'strażacy'],
    paleta: { tlo: '#1A0A0A', akcent: '#DC2626', tekst: '#FEE2E2', drugi: '#FBBF24' },
    typografia: { naglowek: 'Barlow Condensed', tekst: 'Barlow', rozmiarMiesiac: 14, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-osp-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 26, W, PH - 14, {
        opis: 'Zdjęcie OSP — wóz, remiza lub załoga',
        ramka: { szerokosc: 2, kolor: '#FBBF24' },
      })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#FBBF24', rozmiar: 13, uppercase: true, letterSpacing: 2, waga: 'bold' },
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + PH - 1, szerokosc: W, kolor: '#DC2626', grubosc: 2 },
        { typ: 'linia', x: M, y: M + PH + 1, szerokosc: W, kolor: '#FBBF24', grubosc: 1 },
      ],
    },
  },
  {
    id: 'TEM-04', nazwa: 'Ginger Kotek', kategoria: 'koty',
    opis: 'Rudy kot w okrągłej ramce — uroczy, przyjazny design.',
    tagi: ['koty', 'rudy'],
    paleta: { tlo: '#FFF5EB', akcent: '#D35400', tekst: '#5C3D2E' },
    typografia: { naglowek: 'Comfortaa', tekst: 'Quicksand', rozmiarMiesiac: 13, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'tem-koty-circle',
      strefyMiesiac: () => [zone('foto', 'okrag', M + 30, M + 10, 126, 126, { opis: 'Okrągłe zdjęcie kota', maska: 'okrag' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#D35400', center: true, rozmiar: 13 },
    },
  },
  {
    id: 'TEM-05', nazwa: 'Labrador Retriever', kategoria: 'psy',
    opis: 'Krajobraz z psem po prawej — idealny na zdjęcia spacerów i plaży.',
    tagi: ['psy', 'labrador'],
    paleta: { tlo: '#FAFAF5', akcent: '#8B6914', tekst: '#333333' },
    typografia: { naglowek: 'Merriweather', tekst: 'Source Sans 3', rozmiarMiesiac: 12, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'tem-psy-right',
      strefyMiesiac: () => [zone('foto', 'kolumna', M + CW, M, PW, H, { opis: 'Labrador na zdjęciu klienta' })],
      strefaKalendarza: CAL_LEFT,
      titleOpts: { kolor: '#8B6914', rozmiar: 12 },
    },
  },
  {
    id: 'TEM-06', nazwa: 'Remiza OSP', kategoria: 'osp',
    opis: 'Zdjęcie remizy lub sprzętu strażackiego — dumna tradycja OSP.',
    tagi: ['osp', 'remiza'],
    paleta: { tlo: '#F5F5F5', akcent: '#B91C1C', tekst: '#1F1F1F' },
    typografia: { naglowek: 'Oswald', tekst: 'Roboto', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-osp-landscape',
      strefyMiesiac: () => [zone('foto', 'pasek', M, M + 8, W, PH - 12, { opis: 'Remiza lub wóz strażacki' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#B91C1C', rozmiar: 13, uppercase: true },
    },
  },
  {
    id: 'TEM-07', nazwa: 'Stadnina Koni', kategoria: 'konie',
    opis: 'Elegancki kalendarz jeździecki — konie w górnej strefie 60%.',
    tagi: ['konie', 'jeździectwo'],
    paleta: { tlo: '#FAF6F0', akcent: '#6B4423', tekst: '#2C1810' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Lato', rozmiarMiesiac: 13, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'tem-konie-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie konia' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#6B4423', rozmiar: 13 },
    },
  },
  {
    id: 'TEM-08', nazwa: 'Motocyklowa Droga', kategoria: 'motocykle',
    opis: 'Dla fanów jednej szpuli — dynamiczne zdjęcie motocykla.',
    tagi: ['motocykle', 'droga'],
    paleta: { tlo: '#111111', akcent: '#F97316', tekst: '#E5E5E5' },
    typografia: { naglowek: 'Rajdhani', tekst: 'Roboto', rozmiarMiesiac: 14, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-moto-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 18, { opis: 'Motocykl na zdjęciu' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#F97316', rozmiar: 13, uppercase: true, letterSpacing: 3 },
    },
  },
  {
    id: 'TEM-09', nazwa: 'Boisko Marzeń', kategoria: 'sport',
    opis: 'Piłkarski kalendarz — zdjęcie z boiska lub drużyny.',
    tagi: ['piłka', 'sport'],
    paleta: { tlo: '#F0FFF4', akcent: '#16A34A', tekst: '#14532D' },
    typografia: { naglowek: 'Archivo Black', tekst: 'Work Sans', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-sport-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie piłkarskie' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#16A34A', rozmiar: 13, uppercase: true },
    },
  },
  {
    id: 'TEM-10', nazwa: 'Gitara i Melodia', kategoria: 'muzyka',
    opis: 'Muzyczny kalendarz — instrument, koncert lub artysta.',
    tagi: ['muzyka', 'gitara'],
    paleta: { tlo: '#1C1917', akcent: '#A855F7', tekst: '#F5F5F4' },
    typografia: { naglowek: 'Lobster Two', tekst: 'Nunito', rozmiarMiesiac: 15, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-muzyka-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 26, W, PH - 14, { opis: 'Zdjęcie muzyczne' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#A855F7', rozmiar: 14 },
    },
  },
  {
    id: 'TEM-11', nazwa: 'Nad Wodą', kategoria: 'wędkarstwo',
    opis: 'Wędkarski kalendarz — jezioro, rzeka, połów.',
    tagi: ['wędkarstwo', 'natura'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A5F' },
    typografia: { naglowek: 'Bitter', tekst: 'Open Sans', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-wedka-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie wędkarskie' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#1D4ED8', rozmiar: 13 },
    },
  },
  {
    id: 'TEM-12', nazwa: 'Koty Ragdoll', kategoria: 'koty',
    opis: 'Dwa zdjęcia kotów w strefie 60% — dla hodowców i miłośników.',
    tagi: ['koty', 'ragdoll'],
    paleta: { tlo: '#F8F4FF', akcent: '#7C3AED', tekst: '#3B2667' },
    typografia: { naglowek: 'Pacifico', tekst: 'Lato', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-koty-duet',
      strefyMiesiac: () => [
        zone('foto-a', 'kolaż', M, M + 14, 90, PH - 22, { opis: 'Kot 1' }),
        zone('foto-b', 'kolaż', M + 96, M + 14, 90, PH - 22, { opis: 'Kot 2' }),
      ],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#7C3AED', center: true, rozmiar: 13 },
    },
  },
  {
    id: 'TEM-13', nazwa: 'Psie Pastele', kategoria: 'psy',
    opis: 'Pastelowe Polaroidy psów — słodki, rodzinny charakter.',
    tagi: ['psy', 'pastel'],
    paleta: { tlo: '#FFF0F5', akcent: '#EC4899', tekst: '#4A1942' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 12, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-psy-polaroid',
      strefyMiesiac: () => [
        zone('pol1', 'polaroid', M + 18, M + 12, 76, 88, { opis: 'Polaroid pies 1', obrot: -5, ramka: { szerokosc: 3, kolor: '#FFF', marginesDolny: 12 } }),
        zone('pol2', 'polaroid', M + 52, M + 22, 76, 88, { opis: 'Polaroid pies 2', obrot: 4, ramka: { szerokosc: 3, kolor: '#FFF', marginesDolny: 12 } }),
        zone('pol3', 'polaroid', M + 92, M + 8, 76, 88, { opis: 'Polaroid pies 3', obrot: -2, ramka: { szerokosc: 3, kolor: '#FFF', marginesDolny: 12 } }),
      ],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#EC4899', rozmiar: 12 },
    },
  },
  {
    id: 'TEM-14', nazwa: 'Straż Ogniowa', kategoria: 'osp',
    opis: 'Dramatyczny kalendarz strażacki — akcja, odwaga, zespół.',
    tagi: ['osp', 'akcja'],
    paleta: { tlo: '#0C0C0C', akcent: '#EF4444', tekst: '#FAFAFA' },
    typografia: { naglowek: 'Anton', tekst: 'Roboto', rozmiarMiesiac: 14, rozmiarDzien: 7 },
    layout: {
      ukladMiesiac: 'tem-osp-action',
      strefyMiesiac: () => [zone('foto', 'hero', 0, 0, 210, Math.round(297 * 0.6), { opis: 'Akcja strażacka — dynamiczne ujęcie' })],
      strefaKalendarza: { x: M, y: M + PH - 4, szerokosc: W, wysokosc: CH + 4 },
      titleOpts: { kolor: '#EF4444', rozmiar: 13, uppercase: true, letterSpacing: 2 },
      efektyStrony: { frostedGlass: true },
      dekoracjeMiesiac: () => [{ typ: 'frosted-panel', x: M, y: M + PH - 4, szerokosc: W, wysokosc: CH + 4 }],
    },
  },
  {
    id: 'TEM-15', nazwa: 'Podwodny Świat', kategoria: 'akwarystyka',
    opis: 'Akwarium i ryby — niebieska, wodna estetyka.',
    tagi: ['akwarium', 'ryby'],
    paleta: { tlo: '#E0F7FA', akcent: '#00838F', tekst: '#004D56' },
    typografia: { naglowek: 'Righteous', tekst: 'Open Sans', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-akwarium-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 26, W, PH - 14, { opis: 'Akwarium lub ryby' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#00838F', rozmiar: 13 },
      dekoracjeMiesiac: () => [{ typ: 'fala', x: M, y: M + PH - 8, szerokosc: W, kolor: '#E0F7FA' }],
    },
  },
  {
    id: 'TEM-16', nazwa: 'Polskie Zamki', kategoria: 'zamki',
    opis: 'Zamki i pałace Polski — turystyczny, historyczny.',
    tagi: ['zamki', 'historia'],
    paleta: { tlo: '#FAF5EF', akcent: '#78350F', tekst: '#292524' },
    typografia: { naglowek: 'Cinzel', tekst: 'EB Garamond', rozmiarMiesiac: 12, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-zamki-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 26, W, PH - 14, { opis: 'Zamek na zdjęciu' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#78350F', rozmiar: 12 },
    },
  },
  {
    id: 'TEM-17', nazwa: 'Fotografia Analog', kategoria: 'fotografia',
    opis: 'Dla fotografów — kadry, aparaty, czarno-białe ujęcia.',
    tagi: ['foto', 'analog'],
    paleta: { tlo: '#FAFAFA', akcent: '#171717', tekst: '#404040' },
    typografia: { naglowek: 'Space Mono', tekst: 'Inter', rozmiarMiesiac: 11, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'tem-foto-left',
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Zdjęcie fotograficzne' })],
      strefaKalendarza: CAL_RIGHT,
      titleOpts: { kolor: '#171717', rozmiar: 11 },
    },
  },
  {
    id: 'TEM-18', nazwa: 'Smaki Domu', kategoria: 'kuchnia',
    opis: 'Kulinarny kalendarz — potrawy, gotowanie, rodzinne chwile.',
    tagi: ['kuchnia', 'jedzenie'],
    paleta: { tlo: '#FFFBEB', akcent: '#D97706', tekst: '#451A03' },
    typografia: { naglowek: 'Lobster', tekst: 'Lato', rozmiarMiesiac: 14, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-kuchnia-top',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie kulinarne' })],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#D97706', rozmiar: 13 },
    },
  },
  {
    id: 'TEM-19', nazwa: 'Młodzieżowa OSP', kategoria: 'osp',
    opis: 'Kalendarz młodzieżowej OSP — przyszłość straży pożarnej.',
    tagi: ['osp', 'młodzież'],
    paleta: { tlo: '#FFFFFF', akcent: '#DC2626', tekst: '#1F2937', drugi: '#2563EB' },
    typografia: { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 12, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'tem-osp-mlodziez',
      strefyMiesiac: () => [
        zone('foto', 'hero', M, 30, W, PH - 18, { opis: 'Młodzieżowa OSP na zdjęciu' }),
      ],
      strefaKalendarza: CAL_BOTTOM,
      titleOpts: { kolor: '#DC2626', rozmiar: 12, waga: 'bold' },
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: M, y: M + PH, szerokosc: W / 2, kolor: '#DC2626', grubosc: 2 },
        { typ: 'linia', x: M + W / 2, y: M + PH, szerokosc: W / 2, kolor: '#2563EB', grubosc: 2 },
      ],
    },
  },
];

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  opis: def.opis,
  tagi: def.tagi,
  proporcja: { kalendarium: 40, zdjecie: 60 },
  paleta: def.paleta,
  typografia: def.typografia,
  kolekcja: 'tematyczne',
  strony: [
    {
      numer: 1, typ: 'okladka', etykieta: 'Okładka',
      proporcja: { kalendarium: 40, zdjecie: 60 },
      uklad: `${def.layout.ukladMiesiac}-cover`,
      strefyZdjec: def.layout.strefyMiesiac(0, 'Okładka'),
      strefaKalendarza: def.layout.strefaKalendarza,
    },
    ...MIESIACE.map((m, i) => monthPage(def.layout, i + 1, m)),
  ],
}));

const plan = {
  meta: {
    wersja: '1.0.0',
    dataUtworzenia: '2026-06-14',
    projekt: 'Kalendarium+ Tematyczne',
    opis: '19 kalendarzy tematycznych 40/60 — koty, psy, OSP i więcej, z imieninami',
    liczbaSzablonow: 19,
    kolekcja: 'tematyczne',
  },
  formatWspolny: {
    proporcja: { kalendarium: 40, zdjecie: 60 },
    imieniny: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf-8');
console.log(`Wygenerowano ${kalendaria.length} kalendarzy tematycznych → ${OUT}`);
