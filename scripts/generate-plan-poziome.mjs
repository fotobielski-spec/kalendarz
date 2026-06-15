/**
 * 13 kalendarzy 13-stronicowych A4 poziom (297×210 mm)
 * Okładka + 12 miesięcy · proporcja 40% kalendarium / 60% zdjęcie
 * node scripts/generate-plan-poziome.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-poziome.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12;
const PAGE_W = 297;
const PAGE_H = 210;
const W = 273;
const H = 186;
const CX = PAGE_W / 2;
const PROP = { kalendarium: 40, zdjecie: 60 };
const PW = Math.round(W * PROP.zdjecie / 100);
const CW = W - PW;
const PH = Math.round(H * PROP.zdjecie / 100);
const CH = H - PH;
const PW50 = Math.round(W * 0.5);
const CW50 = W - PW50;
const PH85 = Math.round(H * 0.85);
const CH15 = H - PH85;
const PROP1090 = { kalendarium: 10, zdjecie: 90 };
const PH50 = Math.round(H * 0.5);
const CH50 = H - PH50;

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id, typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    proporcjeZalecane: opts.proporcje ?? `${w}:${h}`,
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    ramka: opts.ramka ?? null,
    clipPath: opts.clipPath ?? null,
    opis: opts.opis ?? '',
    wymagane: opts.wymagane ?? true,
    minDpi: 300,
    zalecaneRozdzielczosciPx: {
      szerokosc: Math.round((w / 25.4) * 300),
      wysokosc: Math.round((h / 25.4) * 300),
    },
  };
}

function calTitle(cal, paleta, rozmiar = 14, opts = {}) {
  return {
    nazwaMiesiaca: {
      x: opts.x ?? cal.x + cal.szerokosc / 2,
      y: opts.y ?? cal.y + 4,
      rozmiar,
      wyrownanie: opts.wyrownanie ?? 'center',
      kolor: opts.kolor ?? paleta.akcent,
      waga: 'bold',
      transform: opts.uppercase ? 'uppercase' : undefined,
      letterSpacing: opts.letterSpacing,
    },
  };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca, paleta) {
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: layout.proporcja ?? PROP,
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: layout.strefaKalendarza,
    typografia: layout.typografiaMiesiac ?? calTitle(layout.strefaKalendarza, paleta, layout.titleRozmiar ?? 14),
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr, nazwaMiesiaca) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

function coverPage(def, paleta) {
  const l = def.layout;
  return {
    numer: 1,
    typ: 'okladka',
    etykieta: 'Okładka',
    proporcja: l.proporcja ?? PROP,
    uklad: `${l.ukladMiesiac}-cover`,
    strefyZdjec: l.strefyMiesiac(0, 'Okładka'),
    strefaKalendarza: l.strefaKalendarzaOkladka ?? l.strefaKalendarza,
    elementyTekstowe: l.elementyOkładka ?? [
      { id: 'tytul', tekst: def.nazwa, pozycja: { x: CX, y: M + H - 28 }, rozmiar: 16, wyrownanie: 'center' },
      { id: 'rok', tekst: '{rok}', pozycja: { x: CX, y: M + H - 12 }, rozmiar: 32, wyrownanie: 'center', kolor: paleta.akcent },
    ],
    dekoracje: l.dekoracjeOkładka?.() ?? [],
  };
}

const DEFINICJE = [
  {
    id: 'POZ-01', nazwa: 'Panorama Lewa', kategoria: 'krajobraz',
    opis: 'A4 poziom — szeroka panorama po lewej (60%), kalendarz z imieninami po prawej (40%).',
    tagi: ['poziom', 'photo-left', 'panorama'],
    paleta: { tlo: '#F8FAFC', akcent: '#0F4C81', tekst: '#0C2340' },
    typografia: { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 15, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'poz-photo-left-60',
      titleRozmiar: 14,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Panorama krajobrazu lub rodziny — lewa 60%' })],
      strefaKalendarza: { x: M + PW, y: M, szerokosc: CW, wysokosc: H },
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + PW, y: M, wysokosc: H, kolor: '#0F4C81', grubosc: 2 }],
    },
  },
  {
    id: 'POZ-02', nazwa: 'Panorama Prawa', kategoria: 'editorial',
    opis: 'A4 poziom — kalendarz po lewej, szerokie zdjęcie po prawej (60%).',
    tagi: ['poziom', 'photo-right', 'editorial'],
    paleta: { tlo: '#FFFFFF', akcent: '#1A1A2E', tekst: '#16213E' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 14, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'poz-photo-right-60',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'kolumna', M + CW, M, PW, H, { opis: 'Portret lub scena — prawa 60%' })],
      strefaKalendarza: { x: M, y: M, szerokosc: CW, wysokosc: H },
      typografiaMiesiac: calTitle({ x: M, y: M, szerokosc: CW, wysokosc: H }, { akcent: '#1A1A2E' }, 13, { x: M + 4, y: M + 6, wyrownanie: 'left' }),
    },
  },
  {
    id: 'POZ-03', nazwa: 'Kinowy Pasek', kategoria: 'kinematograficzny',
    opis: 'A4 poziom — trzy kadry filmowe u góry (60%), kalendarz na dole (40%).',
    tagi: ['poziom', 'filmstrip', 'kinowy'],
    paleta: { tlo: '#141414', akcent: '#FFD700', tekst: '#E8E8E8' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Roboto Mono', rozmiarMiesiac: 16, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'poz-filmstrip-top',
      titleRozmiar: 14,
      strefyMiesiac: () => [
        zone('kadr1', 'kolaż', M + 4, M + 10, 84, PH - 16, { opis: 'Kadr 1' }),
        zone('kadr2', 'kolaż', M + 94, M + 10, 84, PH - 16, { opis: 'Kadr 2' }),
        zone('kadr3', 'kolaż', M + 184, M + 10, 84, PH - 16, { opis: 'Kadr 3' }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: calTitle({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, { akcent: '#FFD700' }, 14, { uppercase: true }),
      dekoracjeMiesiac: () => [{ typ: 'perforacja', y: M + 6, szerokosc: W }],
    },
  },
  {
    id: 'POZ-04', nazwa: 'Split Równy', kategoria: 'minimal',
    opis: 'A4 poziom — równy podział 50/50: zdjęcie lewo, kalendarz prawo.',
    tagi: ['poziom', 'split', '50-50'],
    paleta: { tlo: '#FAFAFA', akcent: '#334155', tekst: '#0F172A' },
    typografia: { naglowek: 'DM Sans', tekst: 'Inter', rozmiarMiesiac: 14, rozmiarDzien: 8.5 },
    layout: {
      proporcja: { kalendarium: 50, zdjecie: 50 },
      ukladMiesiac: 'poz-split-50',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW50, H, { opis: 'Zdjęcie — lewa połowa' })],
      strefaKalendarza: { x: M + PW50, y: M, szerokosc: CW50, wysokosc: H },
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + PW50, y: M, wysokosc: H, kolor: '#334155', grubosc: 1 }],
    },
  },
  {
    id: 'POZ-05', nazwa: 'Vogue Poziom', kategoria: 'fashion',
    opis: 'A4 poziom — editorial Vogue: zdjęcie full-bleed lewo 60%, cienka kolumna kalendarza.',
    tagi: ['poziom', 'vogue', 'fashion'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#111111' },
    typografia: { naglowek: 'Bodoni Moda', tekst: 'Helvetica Neue', rozmiarMiesiac: 13, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'poz-vogue-left',
      titleRozmiar: 12,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Fashion full-bleed lewo' })],
      strefaKalendarza: { x: M + PW, y: M + 18, szerokosc: CW, wysokosc: H - 18 },
      typografiaMiesiac: calTitle({ x: M + PW, y: M, szerokosc: CW, wysokosc: H }, { akcent: '#000' }, 11, {
        x: M + PW + 2, y: M + 4, wyrownanie: 'left', uppercase: true, letterSpacing: 3,
      }),
    },
  },
  {
    id: 'POZ-06', nazwa: 'Pas Panoramy', kategoria: 'krajobraz',
    opis: 'A4 poziom — szeroki pas zdjęcia u góry (50%), kalendarz na dole (50%).',
    tagi: ['poziom', 'panorama-top', '50-50'],
    paleta: { tlo: '#EFF6FF', akcent: '#1D4ED8', tekst: '#1E3A8A' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 15, rozmiarDzien: 8 },
    layout: {
      proporcja: { kalendarium: 50, zdjecie: 50 },
      ukladMiesiac: 'poz-panorama-top-50',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 4, W, PH50 - 6, { opis: 'Szeroka panorama — górna połowa' })],
      strefaKalendarza: { x: M, y: M + PH50, szerokosc: W, wysokosc: CH50 },
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M, y: M + PH50 - 1, szerokosc: W, kolor: '#1D4ED8', grubosc: 2 }],
    },
  },
  {
    id: 'POZ-07', nazwa: 'Pełny Ekran', kategoria: 'artystyczny',
    opis: 'A4 poziom — zdjęcie na pełnej stronie z półprzezroczystą nakładką i kalendarzem.',
    tagi: ['poziom', 'fullscreen', 'overlay'],
    paleta: { tlo: '#111111', akcent: '#F5E6C8', tekst: '#FFFFFF' },
    typografia: { naglowek: 'Cinzel', tekst: 'Raleway', rozmiarMiesiac: 14, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'poz-fullscreen-overlay',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'fullscreen', M, M, W, H, { opis: 'Pełnostronicowe zdjęcie tła' })],
      strefaKalendarza: { x: M + W - CW - 8, y: M + 8, szerokosc: CW + 8, wysokosc: H - 16 },
      efektyStrony: { panelPolprzezroczysty: true },
      nakladkaMiesiac: { kolor: 'rgba(0,0,0,0.5)', obszar: { x: M, y: M, szerokosc: W, wysokosc: H } },
    },
  },
  {
    id: 'POZ-08', nazwa: 'Diagonalny Akt', kategoria: 'dynamiczny',
    opis: 'A4 poziom — dynamiczny podział po przekątnej, zdjęcie górny trójkąt (60%).',
    tagi: ['poziom', 'diagonal', 'dynamiczny'],
    paleta: { tlo: '#0D0D0D', akcent: '#E63946', tekst: '#F1FAEE' },
    typografia: { naglowek: 'Oswald', tekst: 'Roboto', rozmiarMiesiac: 15, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'poz-diagonal-top',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, PH + 14, {
        opis: 'Zdjęcie artystyczne — strefa diagonalna',
        clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 100%)',
      })],
      strefaKalendarza: { x: M, y: M + PH - 8, szerokosc: W, wysokosc: CH + 8 },
      typografiaMiesiac: calTitle({ x: M, y: M + PH, szerokosc: W, wysokosc: CH }, { akcent: '#E63946' }, 13),
    },
  },
  {
    id: 'POZ-09', nazwa: 'L-Rama Rodzinna', kategoria: 'rodzinny',
    opis: 'A4 poziom — zdjęcia w kształcie L (60%), kalendarz w prawym dolnym rogu.',
    tagi: ['poziom', 'L-frame', 'rodzina'],
    paleta: { tlo: '#FFF8F0', akcent: '#E07A5F', tekst: '#3D405B' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 13, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'poz-L-frame',
      titleRozmiar: 12,
      strefyMiesiac: () => [
        zone('foto-top', 'pasek', M, M, W, Math.round(PH * 0.55), { opis: 'Zdjęcie górne L-ramki' }),
        zone('foto-side', 'kolumna', M, M + Math.round(PH * 0.55), Math.round(PW * 0.5), H - Math.round(PH * 0.55), { opis: 'Zdjęcie boczne L-ramki' }),
      ],
      strefaKalendarza: {
        x: M + Math.round(PW * 0.5) + 4,
        y: M + Math.round(PH * 0.55),
        szerokosc: W - Math.round(PW * 0.5) - 4,
        wysokosc: H - Math.round(PH * 0.55),
      },
    },
  },
  {
    id: 'POZ-10', nazwa: 'Okrągła Aura', kategoria: 'fine-art',
    opis: 'A4 poziom — okrągłe zdjęcie w lewej strefie (60%), kalendarz po prawej.',
    tagi: ['poziom', 'okrag', 'fine-art'],
    paleta: { tlo: '#F5F0EB', akcent: '#9B6B9E', tekst: '#4A3728' },
    typografia: { naglowek: 'Italiana', tekst: 'Raleway', rozmiarMiesiac: 14, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'poz-circle-left',
      titleRozmiar: 13,
      strefyMiesiac: () => [zone('foto', 'okrag', M + 18, M + 18, 128, 128, {
        opis: 'Okrągłe zdjęcie portretowe', maska: 'okrag',
        ramka: { szerokosc: 3, kolor: '#9B6B9E' },
      })],
      strefaKalendarza: { x: M + PW, y: M, szerokosc: CW, wysokosc: H },
      dekoracjeMiesiac: () => [{ typ: 'pierścienie', cx: M + 82, cy: M + 82, promienie: [68, 74], kolor: '#9B6B9E' }],
    },
  },
  {
    id: 'POZ-11', nazwa: 'Polaroid Memories', kategoria: 'retro',
    opis: 'A4 poziom — trzy Polaroidy u góry (60%), kalendarz na dole (40%).',
    tagi: ['poziom', 'polaroid', 'retro'],
    paleta: { tlo: '#F5E6D3', akcent: '#8B4513', tekst: '#3E2723' },
    typografia: { naglowek: 'Pacifico', tekst: 'Courier Prime', rozmiarMiesiac: 14, rozmiarDzien: 7.5 },
    layout: {
      ukladMiesiac: 'poz-polaroid-top',
      titleRozmiar: 13,
      strefyMiesiac: () => [
        zone('pol1', 'polaroid', M + 12, M + 8, 78, 88, { opis: 'Polaroid 1', obrot: -5, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 12 } }),
        zone('pol2', 'polaroid', M + 98, M + 14, 78, 88, { opis: 'Polaroid 2', obrot: 3, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 12 } }),
        zone('pol3', 'polaroid', M + 184, M + 10, 78, 88, { opis: 'Polaroid 3', obrot: -2, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 12 } }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
    },
  },
  {
    id: 'POZ-12', nazwa: 'Złota Godzina', kategoria: 'klasyczny',
    opis: 'A4 poziom — ciepła panorama lewo (60%), elegancki kalendarz prawo z linią złota.',
    tagi: ['poziom', 'złoto', 'klasyczny'],
    paleta: { tlo: '#FFFBF5', akcent: '#C9A227', tekst: '#2C2416' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 15, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'poz-gold-left',
      titleRozmiar: 14,
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Panorama złotej godziny — lewa 60%' })],
      strefaKalendarza: { x: M + PW, y: M, szerokosc: CW, wysokosc: H },
      dekoracjeMiesiac: () => [
        { typ: 'linia-pionowa', x: M + PW, y: M, wysokosc: H, kolor: '#C9A227', grubosc: 2 },
        { typ: 'linia-zlota', pozycja: { x: M + PW + 4, y: M + H - 6 }, szerokosc: CW - 8 },
      ],
      elementyOkładka: [
        { id: 'tytul', tekst: 'Kalendarium+ {rok}', pozycja: { x: CX, y: M + H - 36 }, rozmiar: 18, wyrownanie: 'center', kolor: '#C9A227' },
        { id: 'podtytul', tekst: 'Złota Godzina', pozycja: { x: CX, y: M + H - 14 }, rozmiar: 11, wyrownanie: 'center' },
      ],
    },
  },
  {
    id: 'POZ-13', nazwa: 'Pasek Dolny', kategoria: 'minimal',
    opis: 'A4 poziom — 85% duże zdjęcie, pasek kalendarza na dole (15%) z dniami tygodnia. Miesiąc lewy dół, rok prawy góra, bez imienin.',
    tagi: ['poziom', 'pasek', '10-90', 'minimal'],
    paleta: { tlo: '#FFFFFF', akcent: '#18181B', tekst: '#27272A' },
    typografia: { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 11, rozmiarDzien: 7 },
    layout: {
      proporcja: { kalendarium: 15, zdjecie: 85 },
      ukladMiesiac: 'poz-strip-bottom',
      titleRozmiar: 11,
      strefyMiesiac: () => [
        zone('foto', 'hero', M, M, W, PH85, { opis: 'Duże zdjęcie — 85% powierzchni strony' }),
      ],
      strefaKalendarza: { x: 0, y: M + PH85, szerokosc: PAGE_W, wysokosc: CH15, uklad: 'pasek-dol' },
      typografiaMiesiac: {
        nazwaMiesiaca: { x: M + 2, y: M + PH85 - 4, rozmiar: 11, wyrownanie: 'left', kolor: '#18181B' },
      },
      dekoracjeMiesiac: () => [
        { typ: 'linia', x: 0, y: M + PH85, szerokosc: PAGE_W, kolor: '#18181B', grubosc: 0.5 },
      ],
      elementyOkładka: [
        { id: 'rok', tekst: '{rok}', pozycja: { x: M + W - 4, y: M + 8 }, rozmiar: 28, wyrownanie: 'right', kolor: '#18181B' },
        { id: 'tytul', tekst: 'Pasek Dolny', pozycja: { x: M + 4, y: M + H - 6 }, rozmiar: 12, wyrownanie: 'left' },
      ],
    },
  },
];

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  kolekcja: 'poziome',
  orientacja: 'landscape',
  opis: def.opis,
  tagi: def.tagi,
  paleta: def.paleta,
  typografia: def.typografia,
  proporcja: def.layout.proporcja ?? PROP,
  strony: [
    coverPage(def, def.paleta),
    ...MIESIACE.map((m, i) => monthPage(def.layout, i + 1, m, def.paleta)),
  ],
}));

const plan = {
  meta: {
    wersja: '1.0.0',
    dataUtworzenia: '2026-06-14',
    projekt: 'Kalendarium+ Poziome',
    opis: '13 kalendarzy 13-stronicowych A4 poziom — okładka + 12 miesięcy',
    jezyk: 'pl',
    walutaJednostek: 'mm',
    dpiZalecane: 300,
    liczbaSzablonow: kalendaria.length,
    liczbaStron: 13,
    proporcjaGlobalna: PROP,
    strukturaStron: [
      { numer: 1, typ: 'okladka', etykieta: 'Okładka' },
      ...MIESIACE.map((m, i) => ({ numer: i + 2, typ: 'miesiac', etykieta: m, miesiac: i + 1 })),
    ],
  },
  formatWspolny: {
    nazwa: 'A4 poziom',
    szerokosc: PAGE_W,
    wysokosc: PAGE_H,
    orientacja: 'landscape',
    marginesy: { gora: 12, dol: 12, lewo: 12, prawo: 12 },
    obszarRoboczy: { x: M, y: M, szerokosc: W, wysokosc: H },
    proporcja: {
      kalendarium: { udzial: 40, wysokoscMm: CH, szerokoscMm: CW },
      zdjecie: { udzial: 60, wysokoscMm: PH, szerokoscMm: PW },
    },
    siatkaDni: {
      kolumny: 7, wiersze: 6,
      etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
      pierwszyDzienTygodnia: 'poniedzialek',
    },
    imieniny: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf-8');
console.log(`Wygenerowano ${kalendaria.length} kalendarzy poziomych → ${OUT}`);
