/**
 * 5 kalendarzy pionowych — cyfry przy brzegu kartki + imieniny
 * node scripts/generate-plan-pionowe.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-pionowe.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const M = 12, W = 186, H = 273;
const PH = Math.round(H * 0.6);
const CH = H - PH;
const PW = Math.round(W * 0.62);
const CW = W - PW;
const STRIP_W = 52;

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
  };
}

function calStrip(x, y, w, h, krawedz) {
  return { x, y, szerokosc: w, wysokosc: h, uklad: 'pionowy', krawedz };
}

function monthPage(layout, miesiacNr, nazwaMiesiaca) {
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    proporcja: layout.proporcja ?? { kalendarium: 40, zdjecie: 60 },
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: layout.strefaKalendarza,
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
    efektyStrony: layout.efektyStrony ?? null,
  };
}

const DEFINICJE = [
  {
    id: 'PION-01', nazwa: 'Lista lewa — krawędź',
    kategoria: 'pionowy',
    opis: 'Cyfry dni w pionie przy lewym brzegu kartki, imieniny obok. Zdjęcie po prawej (62%).',
    tagi: ['pionowy', 'imieniny', 'lewo'],
    paleta: { tlo: '#FAFAF8', akcent: '#2D5A4A', tekst: '#1C2B26' },
    typografia: { naglowek: 'DM Serif Display', tekst: 'DM Sans', rozmiarMiesiac: 12, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'pion-lista-lewo',
      proporcja: { kalendarium: 38, zdjecie: 62 },
      strefyMiesiac: () => [zone('foto', 'kolumna', M + STRIP_W, M, W - STRIP_W, H, { opis: 'Portret pionowy klienta' })],
      strefaKalendarza: calStrip(M, M, STRIP_W, H, 'lewo'),
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M + STRIP_W - 1, y: M, szerokosc: 1, wysokosc: H, kolor: '#2D5A4A', grubosc: 2 }],
    },
  },
  {
    id: 'PION-02', nazwa: 'Lista prawa — krawędź',
    kategoria: 'pionowy',
    opis: 'Cyfry przy prawym brzegu kartki, imieniny po lewej od numeru. Zdjęcie po lewej (62%).',
    tagi: ['pionowy', 'imieniny', 'prawo'],
    paleta: { tlo: '#F5F0EB', akcent: '#8B4513', tekst: '#2A1F14' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Source Sans 3', rozmiarMiesiac: 12, rozmiarDzien: 9 },
    layout: {
      ukladMiesiac: 'pion-lista-prawo',
      proporcja: { kalendarium: 38, zdjecie: 62 },
      strefyMiesiac: () => [zone('foto', 'kolumna', M, M, W - STRIP_W, H, { opis: 'Zdjęcie rodzinne' })],
      strefaKalendarza: calStrip(M + W - STRIP_W, M, STRIP_W, H, 'prawo'),
      dekoracjeMiesiac: () => [{ typ: 'linia', x: M + W - STRIP_W + 1, y: M, szerokosc: 1, wysokosc: H, kolor: '#8B4513', grubosc: 2 }],
    },
  },
  {
    id: 'PION-03', nazwa: 'Lista lewa — foto góra',
    kategoria: 'pionowy',
    opis: 'Zdjęcie u góry (60%), pod spodem pionowa lista dni przy lewym brzegu strefy kalendarza.',
    tagi: ['pionowy', 'imieniny', 'góra'],
    paleta: { tlo: '#FFFFFF', akcent: '#1E3A5F', tekst: '#0F1C2E' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Work Sans', rozmiarMiesiac: 11, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'pion-lista-bottom-lewo',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Panorama krajobrazu' })],
      strefaKalendarza: calStrip(M, M + PH, W, CH, 'lewo'),
    },
  },
  {
    id: 'PION-04', nazwa: 'Lista prawa — foto góra',
    kategoria: 'pionowy',
    opis: 'Zdjęcie u góry, cyfry przy prawym brzegu dolnej strefy kalendarza z imieninami.',
    tagi: ['pionowy', 'imieniny', 'góra'],
    paleta: { tlo: '#FFF5F7', akcent: '#BE185D', tekst: '#3B0A1F' },
    typografia: { naglowek: 'Cormorant', tekst: 'Nunito Sans', rozmiarMiesiac: 11, rozmiarDzien: 8 },
    layout: {
      ukladMiesiac: 'pion-lista-bottom-prawo',
      strefyMiesiac: () => [zone('foto', 'hero', M, 28, W, PH - 16, { opis: 'Zdjęcie kwiatów lub portret' })],
      strefaKalendarza: calStrip(M, M + PH, W, CH, 'prawo'),
    },
  },
  {
    id: 'PION-05', nazwa: 'Lista prawa — pełne tło',
    kategoria: 'pionowy',
    opis: 'Zdjęcie na pełnej stronie z pionową listą dni przy prawym brzegu na półprzezroczystym panelu.',
    tagi: ['pionowy', 'imieniny', 'fullscreen'],
    paleta: { tlo: '#111111', akcent: '#F5E6C8', tekst: '#FFFFFF' },
    typografia: { naglowek: 'Cinzel', tekst: 'Raleway', rozmiarMiesiac: 11, rozmiarDzien: 8 },
    efekty: { zdjecia: 'grayscale', kontrast: 1.1 },
    layout: {
      ukladMiesiac: 'pion-lista-overlay-prawo',
      proporcja: { kalendarium: 22, zdjecie: 78 },
      strefyMiesiac: () => [zone('foto', 'fullscreen', M, M, W, H, { opis: 'Pełnostronicowe zdjęcie tła' })],
      strefaKalendarza: calStrip(M + W - STRIP_W - 4, M + 8, STRIP_W + 4, H - 16, 'prawo'),
      efektyStrony: { panelPolprzezroczysty: true },
    },
  },
];

const kalendaria = DEFINICJE.map((def) => ({
  id: def.id,
  nazwa: def.nazwa,
  kategoria: def.kategoria,
  kolekcja: 'pionowe',
  opis: def.opis,
  tagi: def.tagi,
  paleta: def.paleta,
  typografia: def.typografia,
  efekty: def.efekty,
  proporcja: def.layout.proporcja ?? { kalendarium: 40, zdjecie: 60 },
  strony: MIESIACE.map((m, i) => monthPage(def.layout, i + 1, m)),
}));

const plan = {
  meta: {
    rokDomyslny: 2026,
    liczbaSzablonow: kalendaria.length,
    opis: '5 kalendarzy pionowych A4 — cyfry przy brzegu + imieniny',
  },
  formatWspolny: {
    szerokosc: 210,
    wysokosc: 297,
    siatkaDni: { etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'] },
    proporcja: { kalendarium: 40, zdjecie: 60 },
    imieniny: true,
    ukladPionowy: true,
  },
  kalendaria,
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf8');
console.log(`Zapisano ${kalendaria.length} kalendarzy pionowych → ${OUT}`);
