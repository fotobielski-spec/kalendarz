/**
 * 30 przepięknych, różnorodnych kalendarzy A4 pion
 * Proporcja: 40% kalendarium · 60% zdjęcie
 * node scripts/generate-plan-art-40-60.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-art-40-60.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12;
const W = 186;
const H = 273;
const PH = Math.round(H * 0.6); // 164 — strefa zdjęcia
const CH = H - PH;              // 109 — strefa kalendarza
const PW = Math.round(W * 0.6); // 112 — zdjęcie w poziomie
const CW = W - PW;              // 74  — kalendarz w poziomie

function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id, typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    proporcjeZalecane: opts.proporcje ?? `${w}:${h}`,
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    przezroczystosc: opts.przezroczystosc ?? 1,
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

function monthPage(layout, miesiacNr, nazwaMiesiaca) {
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: { kalendarium: 40, zdjecie: 60 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: layout.strefaKalendarza,
    typografia: layout.typografiaMiesiac,
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr, nazwaMiesiaca) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

function buildMonths(layout) {
  return MIESIACE.map((m, i) => monthPage(layout, i + 1, m));
}

/** @type {Array<{id:string,nazwa:string,kategoria:string,opis:string,tagi:string[],paleta:object,typografia:object,layout:object}>} */
const DEFINICJE = [
  {
    id: 'ART-01', nazwa: 'Złota Godzina', kategoria: 'klasyczny',
    opis: 'Zdjęcie u góry (60%), kalendarz u dołu (40%). Ciepła paleta złota godziny.',
    tagi: ['photo-top', 'elegancki', 'ciepły'],
    paleta: { tlo: '#FFFBF5', akcent: '#C9A227', tekst: '#2C2416' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lato', rozmiarMiesiac: 26, rozmiarDzien: 10 },
    layout: {
      ukladMiesiac: 'photo-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, 30, W, PH - 18, { opis: 'Panorama złotej godziny' })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: 16, rozmiar: 26, kolor: '#C9A227' } },
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M, y: M + PH - 1, szerokosc: W, kolor: '#C9A227', grubosc: 2 }],
    },
  },
  {
    id: 'ART-02', nazwa: 'Lewa Poetyka', kategoria: 'editorial',
    opis: 'Zdjęcie zajmuje lewe 60%, kalendarz prawe 40%. Układ magazynowy.',
    tagi: ['photo-left', 'editorial'],
    paleta: { tlo: '#FFFFFF', akcent: '#1A1A2E', tekst: '#16213E' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 16, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'photo-left-60',
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Portret lub scena — lewa strona' })],
      strefaKalendarza: { x: M + PW, y: M, szerokosc: CW, wysokosc: H },
      typografiaMiesiac: { nazwaMiesiaca: { x: M + PW + 4, y: M + 6, rozmiar: 16, transform: 'uppercase', letterSpacing: 3 } },
    },
  },
  {
    id: 'ART-03', nazwa: 'Prawy Horizon', kategoria: 'krajobraz',
    opis: 'Krajobraz po prawej (60%), kalendarz po lewej (40%).',
    tagi: ['photo-right', 'krajobraz'],
    paleta: { tlo: '#F0F4F8', akcent: '#2E86AB', tekst: '#1B2838' },
    typografia: { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 15, rozmiarDzien: 8.5 },
    layout: {
      ukladMiesiac: 'photo-right-60',
      strefyMiesiac: () => [zone('foto', 'kolumna', M + CW, M, PW, H, { opis: 'Krajobraz horyzontalny' })],
      strefaKalendarza: { x: M, y: M, szerokosc: CW, wysokosc: H },
      typografiaMiesiac: { nazwaMiesiaca: { x: M + 4, y: M + 8, rozmiar: 17 } },
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + CW, y: M, wysokosc: H, kolor: '#2E86AB', grubosc: 2 }],
    },
  },
  {
    id: 'ART-04', nazwa: 'Diagonalny Akt', kategoria: 'artystyczny',
    opis: 'Dynamiczny podział po przekątnej — zdjęcie 60% górny trójkąt.',
    tagi: ['diagonal', 'dynamiczny'],
    paleta: { tlo: '#0D0D0D', akcent: '#E63946', tekst: '#F1FAEE' },
    typografia: { naglowek: 'Oswald', tekst: 'Roboto', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'diagonal-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, PH + 20, {
        opis: 'Zdjęcie artystyczne — strefa diagonalna',
        clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
      })],
      strefaKalendarza: { x: M, y: M + PH - 10, szerokosc: W, wysokosc: CH + 10 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 2, rozmiar: 20, kolor: '#E63946' } },
    },
  },
  {
    id: 'ART-05', nazwa: 'L-Frame Rodzinny', kategoria: 'rodzinny',
    opis: 'Zdjęcie w kształcie L otacza kalendarz — 60% powierzchni na fotografie.',
    tagi: ['L-frame', 'rodzina'],
    paleta: { tlo: '#FFF8F0', akcent: '#E07A5F', tekst: '#3D405B' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'L-frame-60',
      strefyMiesiac: () => [
        zone('foto-top', 'pasek', M, M, W, Math.round(PH * 0.65), { opis: 'Zdjęcie górne L-ramki' }),
        zone('foto-side', 'kolumna', M, M + Math.round(PH * 0.65), Math.round(PW * 0.55), H - Math.round(PH * 0.65), { opis: 'Zdjęcie boczne L-ramki' }),
      ],
      strefaKalendarza: { x: M + Math.round(PW * 0.55) + 4, y: M + Math.round(PH * 0.65), szerokosc: W - Math.round(PW * 0.55) - 4, wysokosc: H - Math.round(PH * 0.65) },
      typografiaMiesiac: { nazwaMiesiaca: { x: M + Math.round(PW * 0.55) + 8, y: M + Math.round(PH * 0.65) + 4, rozmiar: 14 } },
    },
  },
  {
    id: 'ART-06', nazwa: 'Odwrócony Klasik', kategoria: 'klasyczny',
    opis: 'Kalendarz u góry (40%), zdjęcie u dołu (60%) — nietypowe odwrócenie.',
    tagi: ['photo-bottom', 'odwrocony'],
    paleta: { tlo: '#FAFAFA', akcent: '#264653', tekst: '#1D3557' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Libre Franklin', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'cal-top-photo-bottom-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M + CH + 8, W, PH - 8, { opis: 'Zdjęcie dolne 60%' })],
      strefaKalendarza: { x: M, y: M, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + 4, rozmiar: 22 } },
    },
  },
  {
    id: 'ART-07', nazwa: 'Okrągła Aura', kategoria: 'fine-art',
    opis: 'Okrągłe zdjęcie w strefie 60% góry, kalendarz pod spodem.',
    tagi: ['okrag', 'fine-art'],
    paleta: { tlo: '#F5F0EB', akcent: '#9B6B9E', tekst: '#4A3728' },
    typografia: { naglowek: 'Italiana', tekst: 'Raleway', rozmiarMiesiac: 24, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'circle-photo-top-60',
      strefyMiesiac: () => [zone('foto', 'okrag', M + 28, M + 8, 130, 130, {
        opis: 'Okrągłe zdjęcie portretowe', maska: 'okrag',
        ramka: { szerokosc: 3, kolor: '#9B6B9E' },
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + PH - 8, rozmiar: 22, wyrownanie: 'center', kolor: '#9B6B9E' } },
      dekoracjeMiesiac: () => [{ typ: 'pierścienie', cx: 105, cy: M + 74, promienie: [72, 78], kolor: '#9B6B9E' }],
    },
  },
  {
    id: 'ART-08', nazwa: 'Filmowy Pasek', kategoria: 'kinematograficzny',
    opis: 'Trzy kadry filmowe w strefie 60% — kinowy charakter.',
    tagi: ['film', 'triptich'],
    paleta: { tlo: '#1C1C1C', akcent: '#FFD700', tekst: '#E8E8E8' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Roboto Mono', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'filmstrip-top-60',
      strefyMiesiac: () => [
        zone('kadr1', 'kolaż', M, M + 14, 58, 130, { opis: 'Kadr filmowy 1' }),
        zone('kadr2', 'kolaż', M + 64, M + 14, 58, 130, { opis: 'Kadr filmowy 2' }),
        zone('kadr3', 'kolaż', M + 128, M + 14, 58, 130, { opis: 'Kadr filmowy 3' }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + 4, rozmiar: 18, kolor: '#FFD700', transform: 'uppercase' } },
      dekoracjeMiesiac: () => [{ typ: 'perforacja', y: M + 8, szerokosc: W }],
    },
  },
  {
    id: 'ART-09', nazwa: 'Magazyn Vogue', kategoria: 'fashion',
    opis: 'Odważna typografia, zdjęcie full-bleed lewa 60%, cienka linia redakcyjna.',
    tagi: ['fashion', 'vogue'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#111111' },
    typografia: { naglowek: 'Bodoni Moda', tekst: 'Helvetica Neue', rozmiarMiesiac: 22, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'vogue-left-60',
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, PW, H, { opis: 'Full-bleed fashion photo' })],
      strefaKalendarza: { x: M + PW, y: M + 24, szerokosc: CW, wysokosc: H - 24 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M + PW + 2, y: M + 6, rozmiar: 18, transform: 'uppercase', letterSpacing: 4 } },
    },
  },
  {
    id: 'ART-10', nazwa: 'Polaroid Memories', kategoria: 'retro',
    opis: 'Stos Polaroidów w strefie 60% — nostalgiczy klimat.',
    tagi: ['polaroid', 'retro'],
    paleta: { tlo: '#F5E6D3', akcent: '#8B4513', tekst: '#3E2723' },
    typografia: { naglowek: 'Pacifico', tekst: 'Courier Prime', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'polaroid-stack-60',
      strefyMiesiac: () => [
        zone('pol1', 'polaroid', M + 20, M + 10, 90, 100, { opis: 'Polaroid 1', obrot: -6, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 14 } }),
        zone('pol2', 'polaroid', M + 55, M + 25, 90, 100, { opis: 'Polaroid 2', obrot: 4, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 14 } }),
        zone('pol3', 'polaroid', M + 85, M + 15, 90, 100, { opis: 'Polaroid 3', obrot: -2, ramka: { szerokosc: 4, kolor: '#FFFFF0', marginesDolny: 14 } }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH - 6, rozmiar: 18 } },
    },
  },
  {
    id: 'ART-11', nazwa: 'Łuk Katedralny', kategoria: 'architektoniczny',
    opis: 'Zdjęcie w łuku gotyckim — górna strefa 60%.',
    tagi: ['arch', 'luk'],
    paleta: { tlo: '#F8F6F2', akcent: '#5C4B37', tekst: '#2C2416' },
    typografia: { naglowek: 'Cinzel', tekst: 'EB Garamond', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'arch-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M + 10, M, W - 20, PH, {
        opis: 'Zdjęcie w łuku katedralnym',
        clipPath: 'ellipse(50% 55% at 50% 45%)',
        maska: 'luk',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + PH - 4, rozmiar: 20, wyrownanie: 'center' } },
      dekoracjeMiesiac: () => [{ typ: 'luk-ramka', x: M + 10, y: M, szerokosc: W - 20, wysokosc: PH, kolor: '#5C4B37' }],
    },
  },
  {
    id: 'ART-12', nazwa: 'Żaluzja Światła', kategoria: 'nowoczesny',
    opis: 'Paski światła i cienia w strefie zdjęcia — gra światłem.',
    tagi: ['zaluzja', 'swiatlo'],
    paleta: { tlo: '#E8E8E8', akcent: '#FF6B35', tekst: '#2B2D42' },
    typografia: { naglowek: 'Archivo Black', tekst: 'Work Sans', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'blinds-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 20, W, PH - 20, { opis: 'Zdjęcie z efektem żaluzji' })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + 6, rozmiar: 20, kolor: '#FF6B35' } },
      dekoracjeMiesiac: () => [{ typ: 'zaluzja', x: M, y: M + 20, szerokosc: W, wysokosc: PH - 20, paski: 8 }],
      efektyStrony: { nakladkaZaluzja: true },
    },
  },
  {
    id: 'ART-13', nazwa: 'Mglisty Gradient', kategoria: 'dreamy',
    opis: 'Miękkie przejście gradientowe między zdjęciem a kalendarzem.',
    tagi: ['gradient', 'dreamy'],
    paleta: { tlo: '#EEF2F7', akcent: '#6B9080', tekst: '#354F52' },
    typografia: { naglowek: 'Josefin Sans', tekst: 'Mulish', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'gradient-fade-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, PH + 25, { opis: 'Zdjęcie z mglistym przejściem' })],
      strefaKalendarza: { x: M, y: M + PH - 15, szerokosc: W, wysokosc: CH + 15 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 2, rozmiar: 20, kolor: '#6B9080' } },
      dekoracjeMiesiac: () => [{ typ: 'gradient-fade', x: M, y: M + PH - 30, szerokosc: W, wysokosc: 40, od: 'transparent', do: '#EEF2F7' }],
    },
  },
  {
    id: 'ART-14', nazwa: 'Podwójna Ekspozycja', kategoria: 'artystyczny',
    opis: 'Efekt double exposure w strefie 60%, kalendarz na półprzezroczystym panelu.',
    tagi: ['double-exposure', 'art'],
    paleta: { tlo: '#1A1A2E', akcent: '#E94560', tekst: '#EAEAEA' },
    typografia: { naglowek: 'Abril Fatface', tekst: 'Lato', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'double-exposure-60',
      strefyMiesiac: () => [
        zone('foto-a', 'tlo', M, M, W, PH + 30, { opis: 'Warstwa A double exposure', przezroczystosc: 0.85 }),
        zone('foto-b', 'hero', M + 20, M + 10, W - 40, PH, { opis: 'Warstwa B double exposure', przezroczystosc: 0.55, efekt: 'multiply' }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH, przezroczysteTlo: 0.92 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 4, rozmiar: 18, kolor: '#E94560' } },
      efektyStrony: { panelPolprzezroczysty: true },
    },
  },
  {
    id: 'ART-15', nazwa: 'Zen Ma', kategoria: 'japoński',
    opis: 'Asymetria wabi-sabi, zdjęcie 60% z przesunięciem, dużo oddechu.',
    tagi: ['zen', 'wabi-sabi'],
    paleta: { tlo: '#F7F3EE', akcent: '#8B7355', tekst: '#3C3630' },
    typografia: { naglowek: 'Noto Serif JP', tekst: 'Noto Sans JP', rozmiarMiesiac: 18, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'zen-offset-60',
      strefyMiesiac: () => [zone('foto', 'hero', M + 30, M + 10, W - 40, PH - 10, { opis: 'Minimalistyczne zdjęcie zen' })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W - 20, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 6, rozmiar: 16, kolor: '#8B7355' } },
      dekoracjeMiesiac: () => [
        { typ: 'kropka', x: M + 6, y: M + PH + 12, rozmiar: 4, kolor: '#8B7355' },
        { typ: 'linia', x: M, y: M + PH - 2, szerokosc: 40, kolor: '#8B7355', grubosc: 1 },
      ],
    },
  },
  {
    id: 'ART-16', nazwa: 'Art Deco Glamour', kategoria: 'art-deco',
    opis: 'Geometryczne złote linie, zdjęcie 60% u góry w ramie deco.',
    tagi: ['art-deco', 'glamour'],
    paleta: { tlo: '#0C0C1E', akcent: '#D4AF37', tekst: '#F5F0E1' },
    typografia: { naglowek: 'Poiret One', tekst: 'Josefin Sans', rozmiarMiesiac: 22, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'deco-frame-60',
      strefyMiesiac: () => [zone('foto', 'ramka', M + 8, M + 18, W - 16, PH - 24, {
        opis: 'Zdjęcie w ramie Art Deco',
        ramka: { styl: 'art-deco', szerokosc: 2, kolor: '#D4AF37' },
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + 10, rozmiar: 20, wyrownanie: 'center', kolor: '#D4AF37', letterSpacing: 8, transform: 'uppercase' } },
      dekoracjeMiesiac: () => [
        { typ: 'deco-narozniki', obszar: { x: M + 8, y: M + 18, szerokosc: W - 16, wysokosc: PH - 24 }, kolor: '#D4AF37' },
        { typ: 'linia', x: M + 40, y: M + PH, szerokosc: W - 80, kolor: '#D4AF37', grubosc: 1 },
      ],
    },
  },
  {
    id: 'ART-17', nazwa: 'Akwarelowy Sen', kategoria: 'akwarela',
    opis: 'Zdjęcie w organicznej plamie akwareli — strefa 60%.',
    tagi: ['akwarela', 'organiczny'],
    paleta: { tlo: '#FDF8F4', akcent: '#7B68EE', tekst: '#4A4063' },
    typografia: { naglowek: 'Dancing Script', tekst: 'Crimson Text', rozmiarMiesiac: 26, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'watercolor-60',
      strefyMiesiac: () => [zone('foto', 'organiczny', M + 15, M + 12, W - 30, PH - 16, {
        opis: 'Zdjęcie w plamie akwareli', maska: 'blob-art',
        clipPath: 'polygon(8% 2%, 92% 0%, 100% 35%, 88% 95%, 12% 100%, 0% 40%)',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + PH - 6, rozmiar: 24, wyrownanie: 'center', styl: 'kursywa', kolor: '#7B68EE' } },
      dekoracjeMiesiac: (mn) => [
        { typ: 'plama-akwarelowa', x: M, y: M + 20, kolor: ['#B5A8FF', '#FFB5C2', '#82E0AA'][mn % 3], rozmiar: 50 },
        { typ: 'plama-akwarelowa', x: M + 130, y: M + 80, kolor: ['#FFD4A3', '#A8D8FF', '#F9A8D4'][(mn + 1) % 3], rozmiar: 40 },
      ],
    },
  },
  {
    id: 'ART-18', nazwa: 'Heksagonalna Komnata', kategoria: 'geometryczny',
    opis: 'Zdjęcie w masce heksagonu — górna strefa 60%.',
    tagi: ['heksagon', 'geometryczny'],
    paleta: { tlo: '#1E1E2F', akcent: '#00D9FF', tekst: '#E0E0E0' },
    typografia: { naglowek: 'Orbitron', tekst: 'Exo 2', rozmiarMiesiac: 18, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'hexagon-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M + 33, M + 16, 120, 130, {
        opis: 'Zdjęcie w heksagonie',
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        maska: 'heksagon',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + 8, rozmiar: 16, wyrownanie: 'center', kolor: '#00D9FF', transform: 'uppercase' } },
      dekoracjeMiesiac: () => [{ typ: 'heksagon-obrys', cx: 105, cy: M + 80, rozmiar: 68, kolor: '#00D9FF' }],
    },
  },
  {
    id: 'ART-19', nazwa: 'Szkło Matowe', kategoria: 'nowoczesny',
    opis: 'Panorama 60% u góry, kalendarz na matowym szkle (frosted glass).',
    tagi: ['frosted-glass', 'ios'],
    paleta: { tlo: '#F2F2F7', akcent: '#007AFF', tekst: '#1C1C1E' },
    typografia: { naglowek: 'SF Pro Display', tekst: 'SF Pro Text', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'frosted-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', 0, 0, 210, Math.round(297 * 0.6), { opis: 'Panorama full-bleed góra' })],
      strefaKalendarza: { x: M, y: M + PH - 8, szerokosc: W, wysokosc: CH + 8 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M + 8, y: M + PH + 4, rozmiar: 18, kolor: '#007AFF' } },
      efektyStrony: { frostedGlass: true },
      dekoracjeMiesiac: () => [{ typ: 'frosted-panel', x: M, y: M + PH - 8, szerokosc: W, wysokosc: CH + 8 }],
    },
  },
  {
    id: 'ART-20', nazwa: 'Złota Spirala', kategoria: 'premium',
    opis: 'Kompozycja złotej spirali — zdjęcie 60% z artystycznym kadrowaniem.',
    tagi: ['spirala', 'fibonacci'],
    paleta: { tlo: '#0A0A0A', akcent: '#C9A96E', tekst: '#F5F0E8' },
    typografia: { naglowek: 'Cinzel Decorative', tekst: 'Cormorant', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'spiral-golden-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 10, W, PH - 10, {
        opis: 'Kadrowanie złotej spirali',
        clipPath: 'inset(0 15% 5% 0 round 0 0 40% 0)',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 4, rozmiar: 18, kolor: '#C9A96E' } },
      dekoracjeMiesiac: () => [{ typ: 'spirala', cx: M + W, cy: M + PH, promien: 80, kolor: '#C9A96E' }],
    },
  },
  {
    id: 'ART-21', nazwa: 'Duet Obrazów', kategoria: 'kolaż',
    opis: 'Dwa zdjęcia obok siebie w strefie 60% — para lub kontrast.',
    tagi: ['duet', 'kolaż'],
    paleta: { tlo: '#FFFFFF', akcent: '#E63946', tekst: '#212529' },
    typografia: { naglowek: 'DM Serif Display', tekst: 'DM Sans', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'duet-top-60',
      strefyMiesiac: () => [
        zone('foto-a', 'kolaż', M, M + 16, 90, PH - 20, { opis: 'Zdjęcie A duetu' }),
        zone('foto-b', 'kolaż', M + 96, M + 16, 90, PH - 20, { opis: 'Zdjęcie B duetu' }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + 6, rozmiar: 20 } },
      dekoracjeMiesiac: () => [{ typ: 'linia-pionowa', x: M + 93, y: M + 16, wysokosc: PH - 20, kolor: '#E63946', grubosc: 2 }],
    },
  },
  {
    id: 'ART-22', nazwa: 'Podarte Wspomnienie', kategoria: 'vintage',
    opis: 'Krawędź „podartego” papieru między zdjęciem (60%) a kalendarzem.',
    tagi: ['podarty', 'vintage'],
    paleta: { tlo: '#F4E8D1', akcent: '#6B4226', tekst: '#3E2723' },
    typografia: { naglowek: 'Special Elite', tekst: 'Merriweather', rozmiarMiesiac: 19, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'torn-edge-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, PH + 5, { opis: 'Zdjęcie vintage z podartą krawędzią' })],
      strefaKalendarza: { x: M, y: M + PH + 5, szerokosc: W, wysokosc: CH - 5 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 12, rozmiar: 18, kolor: '#6B4226' } },
      dekoracjeMiesiac: () => [{ typ: 'podarta-krawedz', x: M, y: M + PH, szerokosc: W, kolor: '#F4E8D1' }],
    },
  },
  {
    id: 'ART-23', nazwa: 'Neon Nights', kategoria: 'cyberpunk',
    opis: 'Neonowe akcenty, ciemny kalendarz 40%, żywe zdjęcie 60%.',
    tagi: ['neon', 'cyberpunk'],
    paleta: { tlo: '#0D0221', akcent: '#FF00FF', tekst: '#00FFFF', drugi: '#FF6EC7' },
    typografia: { naglowek: 'Audiowide', tekst: 'Rajdhani', rozmiarMiesiac: 18, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'neon-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M - 4, M, W + 8, PH, {
        opis: 'Neonowe zdjęcie miejskie nocą',
        ramka: { szerokosc: 2, kolor: '#FF00FF' },
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 4, rozmiar: 16, kolor: '#00FFFF', transform: 'uppercase' } },
      dekoracjeMiesiac: () => [
        { typ: 'neon-linia', x: M, y: M + PH, szerokosc: W, kolor: '#FF00FF' },
        { typ: 'neon-poswiata', x: M, y: M, szerokosc: W, wysokosc: PH, kolor: '#FF00FF' },
      ],
    },
  },
  {
    id: 'ART-24', nazwa: 'Botaniczny Wieniec', kategoria: 'botanika',
    opis: 'Zdjęcie otoczone wiankiem liści — strefa 60% u góry.',
    tagi: ['botanika', 'wieniec'],
    paleta: { tlo: '#F0F7F0', akcent: '#2D6A4F', tekst: '#1B4332' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lora', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'wreath-top-60',
      strefyMiesiac: () => [zone('foto', 'okrag', M + 28, M + 14, 130, 130, {
        opis: 'Zdjęcie w botanicznym wieńcu', maska: 'okrag',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiaca: { nazwaMiesiaca: { x: 105, y: M + PH - 4, rozmiar: 20, wyrownanie: 'center', kolor: '#2D6A4F' } },
      dekoracjeMiesiac: () => [{ typ: 'wieniec-lisci', cx: 105, cy: M + 78, promien: 78, kolor: '#2D6A4F' }],
    },
  },
  {
    id: 'ART-25', nazwa: 'Nordic Breath', kategoria: 'skandynawski',
    opis: 'Skandynawski minimalizm — dużo bieli, zdjęcie 60% z delikatną ramą.',
    tagi: ['nordic', 'minimal'],
    paleta: { tlo: '#FFFFFF', akcent: '#D4C5B5', tekst: '#4A4A4A' },
    typografia: { naglowek: 'Josefin Sans', tekst: 'Karla', rozmiarMiesiac: 16, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'nordic-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M + 20, M + 20, W - 40, PH - 30, {
        opis: 'Minimalistyczne zdjęcie nordyckie',
        ramka: { szerokosc: 1, kolor: '#D4C5B5' },
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 8, rozmiar: 14, letterSpacing: 6, transform: 'uppercase', kolor: '#4A4A4A' } },
    },
  },
  {
    id: 'ART-26', nazwa: 'Brutalist Shadow', kategoria: 'brutalizm',
    opis: 'Surowy beton w kalendarzu 40%, ciepłe zdjęcie 60% u góry.',
    tagi: ['brutalizm', 'beton'],
    paleta: { tlo: '#B8B8B8', akcent: '#FF4500', tekst: '#2C2C2C' },
    typografia: { naglowek: 'Barlow Condensed', tekst: 'Barlow', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'brutalist-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M + 8, W, PH - 8, { opis: 'Ciepłe zdjęcie vs beton' })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 6, rozmiar: 20, kolor: '#FF4500', waga: 'bold' } },
      dekoracjeMiesiac: () => [{ typ: 'tekstura-beton', obszar: { x: M, y: M + PH, szerokosc: W, wysokosc: CH } }],
    },
  },
  {
    id: 'ART-27', nazwa: 'Storyboard 4K', kategoria: 'narracyjny',
    opis: 'Cztery kadry historii w strefie 60% — wizualna opowieść.',
    tagi: ['storyboard', '4-kadry'],
    paleta: { tlo: '#FAFAFA', akcent: '#457B9D', tekst: '#1D3557' },
    typografia: { naglowek: 'Poppins', tekst: 'Poppins', rozmiarMiesiac: 16, rozmiarDzien: 7 },
    layout: {
      ukladMiesiac: 'storyboard-top-60',
      strefyMiesiac: () => [
        zone('kad1', 'kolaż', M, M + 18, 43, 60, { opis: 'Kadr 1' }),
        zone('kad2', 'kolaż', M + 47, M + 18, 43, 60, { opis: 'Kadr 2' }),
        zone('kad3', 'kolaż', M + 94, M + 18, 43, 60, { opis: 'Kadr 3' }),
        zone('kad4', 'kolaż', M + 141, M + 18, 43, 60, { opis: 'Kadr 4' }),
        zone('foto-main', 'hero', M, M + 84, W, PH - 90, { opis: 'Główny kadr storyboardu' }),
      ],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + 6, rozmiar: 14, kolor: '#457B9D' } },
    },
  },
  {
    id: 'ART-28', nazwa: 'Fala Oceanu', kategoria: 'organiczny',
    opis: 'Falowy divider między zdjęciem 60% a kalendarzem 40%.',
    tagi: ['fala', 'ocean'],
    paleta: { tlo: '#E8F4F8', akcent: '#0077B6', tekst: '#023E8A' },
    typografia: { naglowek: 'Lobster Two', tekst: 'Nunito', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'wave-divider-60',
      strefyMiesiac: () => [zone('foto', 'hero', M, M, W, PH + 12, { opis: 'Zdjęcie morskie / niebo' })],
      strefaKalendarza: { x: M, y: M + PH - 4, szerokosc: W, wysokosc: CH + 4 },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 6, rozmiar: 20, kolor: '#0077B6' } },
      dekoracjeMiesiac: () => [{ typ: 'fala', x: M, y: M + PH - 10, szerokosc: W, kolor: '#E8F4F8' }],
    },
  },
  {
    id: 'ART-29', nazwa: 'Origami Fold', kategoria: 'origami',
    opis: 'Iluzja złożonego papieru — zdjęcie 60% z efektem origami.',
    tagi: ['origami', 'paper-fold'],
    paleta: { tlo: '#FFF9F0', akcent: '#C84B31', tekst: '#2C3639' },
    typografia: { naglowek: 'Spectral', tekst: 'Spectral', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'origami-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', M + 5, M + 5, W - 10, PH - 10, {
        opis: 'Zdjęcie z efektem origami',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)',
      })],
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: M, y: M + PH + 4, rozmiar: 18, kolor: '#C84B31' } },
      dekoracjeMiesiac: () => [{ typ: 'origami-fold', x: M + W - 30, y: M + PH - 30, kolor: '#FFF9F0' }],
    },
  },
  {
    id: 'ART-30', nazwa: 'Imperial Luxury', kategoria: 'luksus',
    opis: 'Imperialna elegancja — złote detale, zdjęcie 60% full-bleed góra.',
    tagi: ['luksus', 'imperial'],
    paleta: { tlo: '#1A0F0A', akcent: '#D4AF37', tekst: '#F5E6D3' },
    typografia: { naglowek: 'Cinzel', tekst: 'Montserrat', rozmiarMiesiac: 20, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'imperial-top-60',
      strefyMiesiac: () => [zone('foto', 'hero', 0, 0, 210, Math.round(297 * 0.6), {
        opis: 'Luksusowe zdjęcie full-bleed',
        ramka: { styl: 'imperial', szerokosc: 3, kolor: '#D4AF37', podwojna: true },
      })],
      strefaKalendarza: { x: M + 6, y: M + PH, szerokosc: W - 12, wysokosc: CH },
      typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: M + PH + 8, rozmiar: 18, wyrownanie: 'center', kolor: '#D4AF37', letterSpacing: 4 } },
      dekoracjeMiesiac: () => [
        { typ: 'ornament-narozniki', kolor: '#D4AF37', obszar: { x: M, y: M + PH, szerokosc: W, wysokosc: CH } },
        { typ: 'linia', x: M + 30, y: M + PH, szerokosc: W - 60, kolor: '#D4AF37', grubosc: 1 },
      ],
    },
  },
];

// Fix typo in ART-24
DEFINICJE[23].layout.typografiaMiesiac = DEFINICJE[23].layout.typografiaMiesiaca;
delete DEFINICJE[23].layout.typografiaMiesiaca;

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  opis: def.opis,
  tagi: def.tagi,
  proporcja: { kalendarium: 40, zdjecie: 60 },
  paleta: def.paleta,
  typografia: def.typografia,
  strony: [
    {
      numer: 1,
      typ: 'okladka',
      etykieta: 'Okładka',
      proporcja: { kalendarium: 40, zdjecie: 60 },
      uklad: `${def.layout.ukladMiesiac}-cover`,
      strefyZdjec: def.layout.strefyMiesiac(0, 'Okładka'),
      strefaKalendarza: { x: M, y: M + PH, szerokosc: W, wysokosc: CH },
      elementyTekstowe: [
        { id: 'tytul', tekst: `Kalendarium+ ${def.nazwa}`, pozycja: { x: M, y: M + PH + 20 }, rozmiar: 14 },
        { id: 'rok', tekst: '{rok}', pozycja: { x: 105, y: M + PH + 50 }, rozmiar: 36, wyrownanie: 'center' },
      ],
    },
    ...buildMonths(def.layout),
  ],
}));

const plan = {
  meta: {
    wersja: '1.0.0',
    dataUtworzenia: '2026-06-14',
    projekt: 'Kalendarium+ Art Collection',
    opis: '30 przepięknych, różnorodnych kalendarzy A4 pion — proporcja 40% kalendarium / 60% zdjęcie',
    jezyk: 'pl',
    walutaJednostek: 'mm',
    dpiZalecane: 300,
    liczbaSzablonow: 30,
    liczbaStron: 13,
    proporcjaGlobalna: { kalendarium: 40, zdjecie: 60 },
    strukturaStron: [
      { numer: 1, typ: 'okladka', etykieta: 'Okładka' },
      ...MIESIACE.map((m, i) => ({ numer: i + 2, typ: 'miesiac', etykieta: m, miesiac: i + 1 })),
    ],
  },
  formatWspolny: {
    nazwa: 'A4 pion',
    szerokosc: 210,
    wysokosc: 297,
    orientacja: 'portrait',
    marginesy: { gora: 12, dol: 12, lewo: 12, prawo: 12 },
    obszarRoboczy: { x: 12, y: 12, szerokosc: 186, wysokosc: 273 },
    proporcja: {
      kalendarium: { udzial: 40, wysokoscMm: CH, szerokoscMm: CW },
      zdjecie: { udzial: 60, wysokoscMm: PH, szerokoscMm: PW },
    },
    siatkaDni: {
      kolumny: 7, wiersze: 6,
      etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
      pierwszyDzienTygodnia: 'poniedzialek',
    },
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf-8');
console.log(`Wygenerowano ${kalendaria.length} kalendarzy → ${OUT}`);
