/**
 * Generator szczegółowego planu 20 kalendarzy 13-stronicowych A4 pion
 * Uruchomienie: node scripts/generate-plan-kalendaria.mjs
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/plan-kalendaria-13s.json');

const MIESIACE = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

const STRUKTURA_STRON = [
  { numer: 1, typ: 'okladka', etykieta: 'Okładka' },
  ...MIESIACE.map((m, i) => ({
    numer: i + 2,
    typ: 'miesiac',
    etykieta: m,
    miesiac: i + 1,
  })),
];

/** @param {object} zone */
function zone(id, typ, x, y, w, h, opts = {}) {
  return {
    id,
    typStrefy: typ,
    pozycja: { x, y, szerokosc: w, wysokosc: h },
    proporcjeZalecane: opts.proporcje ?? `${w}:${h}`,
    maska: opts.maska ?? 'prostokat',
    obrot: opts.obrot ?? 0,
    przezroczystosc: opts.przezroczystosc ?? 1,
    ramka: opts.ramka ?? null,
    opis: opts.opis ?? '',
    wymagane: opts.wymagane ?? true,
    minDpi: 300,
    zalecaneRozdzielczosciPx: {
      szerokosc: Math.round((w / 25.4) * 300),
      wysokosc: Math.round((h / 25.4) * 300),
    },
  };
}

/** @param {object} layout */
function monthPage(layout, miesiacNr, nazwaMiesiaca) {
  return {
    numer: miesiacNr + 1,
    typ: 'miesiac',
    etykieta: nazwaMiesiaca,
    miesiac: miesiacNr,
    uklad: layout.ukladMiesiac,
    strefyZdjec: layout.strefyMiesiac(miesiacNr, nazwaMiesiaca),
    strefaKalendarza: layout.strefaKalendarza,
    typografia: layout.typografiaMiesiac,
    dekoracje: layout.dekoracjeMiesiac?.(miesiacNr) ?? [],
  };
}

const KALENDARIA = [
  {
    id: 'KAL-01',
    nazwa: 'Klasyczna Elegancja',
    kategoria: 'klasyczny',
    opis: 'Tradycyjny układ: duże zdjęcie u góry, siatka dni pod spodem. Uniwersalny dla rodzin i firm.',
  },
  {
    id: 'KAL-02',
    nazwa: 'Pełnoekranowe Tło',
    kategoria: 'artystyczny',
    opis: 'Zdjęcie klienta jako tło całej strony z półprzezroczystą nakładką i czytelną siatką dni.',
  },
  {
    id: 'KAL-03',
    nazwa: 'Minimalistyczny Nordycki',
    kategoria: 'minimal',
    opis: 'Dużo białej przestrzeni, cienkie linie, małe zdjęcie w rogu. Skandynawska prostota.',
  },
  {
    id: 'KAL-04',
    nazwa: 'Vintage Polaroid',
    kategoria: 'retro',
    opis: 'Zdjęcia w ramkach stylizowanych na odbitki Polaroid z ciepłymi, retro kolorami.',
  },
  {
    id: 'KAL-05',
    nazwa: 'Magazynowy Asymetryczny',
    kategoria: 'nowoczesny',
    opis: 'Układ editorialowy z przesuniętymi blokami, dużą typografią miesiąca i zdjęciem na 2/3 strony.',
  },
  {
    id: 'KAL-06',
    nazwa: 'Rodzinny Kolaż',
    kategoria: 'rodzinny',
    opis: 'Kolaż 2–4 zdjęć rodzinnych z ciepłą paletą i przyjaznym charakterem.',
  },
  {
    id: 'KAL-07',
    nazwa: 'Botaniczny Ogród',
    kategoria: 'przyroda',
    opis: 'Motywy roślinne, zdjęcie po prawej kolumnie, delikatne ilustracje liści i kwiatów.',
  },
  {
    id: 'KAL-08',
    nazwa: 'Czarno-Biały Kontrast',
    kategoria: 'fotograficzny',
    opis: 'Monochromatyczna estetyka, dramatyczne zdjęcia, wysoki kontrast typografii.',
  },
  {
    id: 'KAL-09',
    nazwa: 'Pastelowy Dziecięcy',
    kategoria: 'dzieciecy',
    opis: 'Miękkie pastele, okrągłe zdjęcie dziecka, zaokrąglone rogi i przyjazne ikony.',
  },
  {
    id: 'KAL-10',
    nazwa: 'Korporacyjny Premium',
    kategoria: 'biznes',
    opis: 'Elegancki kalendarz firmowy z miejscem na logo, zdjęcie zespołu i stonowaną kolorystyką.',
  },
  {
    id: 'KAL-11',
    nazwa: 'Akwarelowy Art',
    kategoria: 'artystyczny',
    opis: 'Zdjęcie w organicznej masce z akwarelowymi plamami i artystyczną typografią.',
  },
  {
    id: 'KAL-12',
    nazwa: 'Industrialny Loft',
    kategoria: 'miejski',
    opis: 'Surowe tekstury betonu i metalu, zdjęcie w industrialnej ramie, ciemna paleta.',
  },
  {
    id: 'KAL-13',
    nazwa: 'Romantyczny Weselny',
    kategoria: 'okolicznosciowy',
    opis: 'Delikatne ornamenty, złote akcenty, zdjęcia pary młodej. Idealny na rocznicę lub prezent ślubny.',
  },
  {
    id: 'KAL-14',
    nazwa: 'Podróżniczy Glob',
    kategoria: 'podroze',
    opis: 'Motywy map i kompasu, zdjęcia z podróży, przygoda i odkrywanie świata.',
  },
  {
    id: 'KAL-15',
    nazwa: 'Sezonowy Czterech Pór Roku',
    kategoria: 'sezonowy',
    opis: 'Każdy kwartał inna paleta kolorów i motyw (zima/wiosna/lato/jesień) dopasowany do miesiąca.',
  },
  {
    id: 'KAL-16',
    nazwa: 'Timeline Polaroid',
    kategoria: 'kolaż',
    opis: 'Na okładce 12 mini Polaroidów (po jednym na miesiąc), strony miesięczne z jednym dużym zdjęciem.',
  },
  {
    id: 'KAL-17',
    nazwa: 'Split Screen',
    kategoria: 'nowoczesny',
    opis: 'Strona podzielona pionowo: lewa połowa zdjęcie, prawa połowa kalendarz.',
  },
  {
    id: 'KAL-18',
    nazwa: 'Kołowy Radialny',
    kategoria: 'eksperymentalny',
    opis: 'Centralne okrągłe zdjęcie, dni ułożone radialnie wokół — nietypowy, designerski układ.',
  },
  {
    id: 'KAL-19',
    nazwa: 'Mozaika Wspomnień',
    kategoria: 'kolaż',
    opis: 'Siatka 6–9 małych zdjęć tworząca mozaikę nad kompaktową siatką dni.',
  },
  {
    id: 'KAL-20',
    nazwa: 'Luksusowy Złoty',
    kategoria: 'premium',
    opis: 'Czarna lub granatowa baza ze złotymi liniami, centralne zdjęcie w ozdobnej ramie.',
  },
];

function buildKAL01() {
  const strefaKal = { x: 12, y: 148, szerokosc: 186, wysokosc: 137 };
  return {
    ...KALENDARIA[0],
    tagi: ['uniwersalny', 'rodzina', 'elegancki', 'prosty'],
    paleta: { tlo: '#FFFFFF', akcent: '#2C3E50', tekst: '#1A1A1A', drugi: '#C0A062' },
    typografia: { naglowek: 'Playfair Display', tekst: 'Lato', rozmiarMiesiac: 28, rozmiarDzien: 10 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'hero-top-calendar-bottom',
        strefyZdjec: [
          zone('okl-hero', 'hero', 12, 12, 186, 160, { opis: 'Główne zdjęcie rodzinne lub firmowe na okładce' }),
          zone('okl-logo', 'miniatura', 148, 228, 50, 50, { opis: 'Opcjonalne logo lub monogram', wymagane: false, maska: 'okrag' }),
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Kalendarz {rok}', pozycja: { x: 12, y: 178 }, rozmiar: 36 },
          { id: 'podtytul', tekst: 'Kalendarium+', pozycja: { x: 12, y: 210 }, rozmiar: 14 },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'photo-top-grid-bottom',
        strefyMiesiac: () => [
          zone(`m${i + 1}-hero`, 'hero', 12, 42, 186, 95, { opis: `Zdjęcie na ${m.toLowerCase()}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 24 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL02() {
  const strefaKal = { x: 18, y: 155, szerokosc: 174, wysokosc: 125, przezroczysteTlo: 0.85 };
  return {
    ...KALENDARIA[1],
    tagi: ['artystyczny', 'pełne tło', 'emocjonalny'],
    paleta: { tlo: '#000000', akcent: '#FFFFFF', tekst: '#FFFFFF', nakladka: 'rgba(0,0,0,0.45)' },
    typografia: { naglowek: 'Montserrat', tekst: 'Open Sans', rozmiarMiesiac: 26, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'fullscreen-background',
        strefyZdjec: [
          zone('okl-tlo', 'tlo', 0, 0, 210, 297, { opis: 'Pełnoekranowe zdjęcie tła okładki' }),
        ],
        nakladka: { kolor: 'rgba(0,0,0,0.35)', obszar: { x: 0, y: 0, szerokosc: 210, wysokosc: 297 } },
        elementyTekstowe: [
          { id: 'tytul', tekst: '{rok}', pozycja: { x: 105, y: 140 }, rozmiar: 72, wyrownanie: 'center', kolor: '#FFFFFF' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'fullscreen-with-overlay-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-tlo`, 'tlo', 0, 0, 210, 297, { opis: `Tło fotograficzne — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 18, y: 20, rozmiar: 22, kolor: '#FFFFFF' } },
        dekoracjeMiesiac: () => [{ typ: 'nakladka', kolor: 'rgba(0,0,0,0.5)', obszar: strefaKal }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL03() {
  const strefaKal = { x: 12, y: 55, szerokosc: 130, wysokosc: 225 };
  return {
    ...KALENDARIA[2],
    tagi: ['minimal', 'skandynawski', 'czysty'],
    paleta: { tlo: '#FAFAFA', akcent: '#E8E4DF', tekst: '#333333', linia: '#D4D0CB' },
    typografia: { naglowek: 'Josefin Sans', tekst: 'Source Sans 3', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'minimal-center',
        strefyZdjec: [
          zone('okl-mini', 'miniatura', 55, 80, 100, 100, { opis: 'Centralne kwadratowe zdjęcie', maska: 'prostokat', proporcje: '1:1' }),
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: '{rok}', pozycja: { x: 105, y: 55 }, rozmiar: 48, wyrownanie: 'center' },
          { id: 'linia', typ: 'linia', pozycja: { x: 80, y: 200 }, szerokosc: 50 },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'grid-left-photo-right',
        strefyMiesiac: () => [
          zone(`m${i + 1}-bok`, 'kolumna', 148, 55, 50, 225, { opis: `Wąska kolumna zdjęcia — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 22, rozmiar: 18, transform: 'uppercase', letterSpacing: 4 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL04() {
  const strefaKal = { x: 12, y: 130, szerokosc: 186, wysokosc: 155 };
  return {
    ...KALENDARIA[3],
    tagi: ['retro', 'polaroid', 'nostalgiczny'],
    paleta: { tlo: '#F5E6D3', akcent: '#8B4513', tekst: '#3E2723', ramka: '#FFFFF0' },
    typografia: { naglowek: 'Pacifico', tekst: 'Courier Prime', rozmiarMiesiac: 22, rozmiarDzien: 10 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'polaroid-scatter',
        strefyZdjec: [
          zone('okl-p1', 'polaroid', 25, 40, 70, 85, { opis: 'Polaroid 1', obrot: -8, ramka: { szerokosc: 4, kolor: '#FFFFF0' } }),
          zone('okl-p2', 'polaroid', 70, 55, 70, 85, { opis: 'Polaroid 2', obrot: 4, ramka: { szerokosc: 4, kolor: '#FFFFF0' } }),
          zone('okl-p3', 'polaroid', 115, 35, 70, 85, { opis: 'Polaroid 3', obrot: -3, ramka: { szerokosc: 4, kolor: '#FFFFF0' } }),
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Wspomnienia {rok}', pozycja: { x: 105, y: 250 }, rozmiar: 28, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'polaroid-top-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-pol`, 'polaroid', 58, 38, 94, 82, {
            opis: `Polaroid — ${m}`,
            ramka: { szerokosc: 5, kolor: '#FFFFF0', marginesDolny: 18 },
            obrot: (i % 2 === 0 ? 2 : -2),
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 20 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL05() {
  const strefaKal = { x: 72, y: 95, szerokosc: 126, wysokosc: 185 };
  return {
    ...KALENDARIA[4],
    tagi: ['magazyn', 'asymetria', 'editorial'],
    paleta: { tlo: '#FFFFFF', akcent: '#FF3366', tekst: '#111111', blok: '#F0F0F0' },
    typografia: { naglowek: 'Bebas Neue', tekst: 'Roboto', rozmiarMiesiac: 48, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'asymmetric-split',
        strefyZdjec: [
          zone('okl-big', 'hero', 0, 0, 140, 297, { opis: 'Duże zdjęcie na 2/3 szerokości okładki' }),
        ],
        elementyTekstowe: [
          { id: 'rok', tekst: '{rok}', pozycja: { x: 155, y: 120 }, rozmiar: 64, obrot: 90 },
          { id: 'tytul', tekst: 'KALENDARZ', pozycja: { x: 155, y: 200 }, rozmiar: 14, letterSpacing: 6 },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'asymmetric-photo-left',
        strefyMiesiac: () => [
          zone(`m${i + 1}-lewo`, 'kolumna', 12, 95, 52, 185, { opis: `Pionowe zdjęcie — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 72, y: 38, rozmiar: 42, transform: 'uppercase' } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL06() {
  const strefaKal = { x: 12, y: 155, szerokosc: 186, wysokosc: 130 };
  return {
    ...KALENDARIA[5],
    tagi: ['rodzina', 'kolaż', 'ciepły'],
    paleta: { tlo: '#FFF8F0', akcent: '#E07A5F', tekst: '#3D405B', drugi: '#81B29A' },
    typografia: { naglowek: 'Quicksand', tekst: 'Nunito', rozmiarMiesiac: 24, rozmiarDzien: 10 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'collage-4-grid',
        strefyZdjec: [
          zone('okl-c1', 'kolaż', 12, 30, 90, 90, { opis: 'Kolaż zdjęcie 1' }),
          zone('okl-c2', 'kolaż', 108, 30, 90, 90, { opis: 'Kolaż zdjęcie 2' }),
          zone('okl-c3', 'kolaż', 12, 128, 90, 90, { opis: 'Kolaż zdjęcie 3' }),
          zone('okl-c4', 'kolaż', 108, 128, 90, 90, { opis: 'Kolaż zdjęcie 4' }),
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Nasza Rodzina {rok}', pozycja: { x: 105, y: 245 }, rozmiar: 22, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'collage-2-top-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-a`, 'kolaż', 12, 42, 90, 100, { opis: `Zdjęcie A — ${m}` }),
          zone(`m${i + 1}-b`, 'kolaż', 108, 42, 90, 100, { opis: `Zdjęcie B — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 22 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL07() {
  const strefaKal = { x: 12, y: 50, szerokosc: 118, wysokosc: 230 };
  return {
    ...KALENDARIA[6],
    tagi: ['natura', 'botaniczny', 'ogród'],
    paleta: { tlo: '#F0F7F0', akcent: '#2D6A4F', tekst: '#1B4332', kwiat: '#95D5B2' },
    typografia: { naglowek: 'Cormorant Garamond', tekst: 'Lora', rozmiarMiesiac: 26, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'botanical-frame',
        strefyZdjec: [
          zone('okl-ogrod', 'hero', 30, 50, 150, 170, { opis: 'Zdjęcie ogrodu, kwiatów lub natury', maska: 'organiczny' }),
        ],
        dekoracje: [
          { typ: 'ilustracja', motyw: 'liscie-rogi', pozycja: 'narozniki' },
          { typ: 'wieniec', pozycja: { x: 30, y: 50, szerokosc: 150, wysokosc: 170 } },
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Ogród {rok}', pozycja: { x: 105, y: 30 }, rozmiar: 30, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'grid-left-photo-right-botanical',
        strefyMiesiac: () => [
          zone(`m${i + 1}-nat`, 'kolumna', 136, 50, 62, 230, { opis: `Zdjęcie przyrodnicze — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 22, rozmiar: 24 } },
        dekoracjeMiesiac: (mn) => [{ typ: 'akcent-sezonowy', miesiac: mn }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL08() {
  const strefaKal = { x: 12, y: 120, szerokosc: 186, wysokosc: 165 };
  return {
    ...KALENDARIA[7],
    tagi: ['monochrom', 'fotografia', 'kontrast'],
    paleta: { tlo: '#FFFFFF', akcent: '#000000', tekst: '#000000', szary: '#888888' },
    typografia: { naglowek: 'Oswald', tekst: 'IBM Plex Sans', rozmiarMiesiac: 32, rozmiarDzien: 10 },
    efekty: { zdjecia: 'grayscale', kontrast: 1.2 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'bw-dramatic',
        strefyZdjec: [
          zone('okl-bw', 'hero', 0, 60, 210, 180, { opis: 'Czarno-białe zdjęcie artystyczne', efekt: 'grayscale' }),
        ],
        elementyTekstowe: [
          { id: 'rok', tekst: '{rok}', pozycja: { x: 12, y: 30 }, rozmiar: 56 },
          { id: 'linia', typ: 'linia-gruba', pozycja: { x: 12, y: 50 }, szerokosc: 80 },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'bw-strip-top',
        strefyMiesiac: () => [
          zone(`m${i + 1}-bw`, 'pasek', 12, 42, 186, 65, { opis: `Pasek B&W — ${m}`, efekt: 'grayscale' }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 28, waga: 'bold' } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL09() {
  const strefaKal = { x: 12, y: 130, szerokosc: 186, wysokosc: 155 };
  return {
    ...KALENDARIA[8],
    tagi: ['dziecko', 'pastel', 'kolorowy'],
    paleta: { tlo: '#FFF5F8', akcent: '#FFB5C2', tekst: '#5C4B7A', drugi: '#B5EAD7', trzeci: '#C7CEEA' },
    typografia: { naglowek: 'Fredoka', tekst: 'Comfortaa', rozmiarMiesiac: 22, rozmiarDzien: 11 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'pastel-playful',
        strefyZdjec: [
          zone('okl-dziecko', 'okrag', 55, 70, 100, 100, { opis: 'Okrągłe zdjęcie dziecka', maska: 'okrag', ramka: { szerokosc: 6, kolor: '#FFB5C2' } }),
        ],
        dekoracje: [
          { typ: 'ksztalt', ksztalt: 'gwiazdka', kolor: '#C7CEEA', pozycja: { x: 20, y: 40 } },
          { typ: 'ksztalt', ksztalt: 'chmurka', kolor: '#B5EAD7', pozycja: { x: 160, y: 50 } },
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Mój Rok {rok}', pozycja: { x: 105, y: 200 }, rozmiar: 26, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'circle-photo-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-ok`, 'okrag', 68, 40, 74, 74, {
            opis: `Okrągłe zdjęcie — ${m}`,
            maska: 'okrag',
            ramka: { szerokosc: 4, kolor: ['#FFB5C2', '#B5EAD7', '#C7CEEA', '#FFDAC1'][i % 4] },
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 20 } },
        dekoracjeMiesiac: (mn) => [{ typ: 'kolor-tla-naglowka', kolor: ['#FFB5C2', '#B5EAD7', '#C7CEEA', '#FFDAC1'][(mn - 1) % 4] }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL10() {
  const strefaKal = { x: 12, y: 100, szerokosc: 186, wysokosc: 185 };
  return {
    ...KALENDARIA[9],
    tagi: ['firma', 'biznes', 'profesjonalny'],
    paleta: { tlo: '#FFFFFF', akcent: '#1A365D', tekst: '#2D3748', drugi: '#718096' },
    typografia: { naglowek: 'Inter', tekst: 'Inter', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'corporate-cover',
        strefyZdjec: [
          zone('okl-zespol', 'pasek', 12, 80, 186, 120, { opis: 'Zdjęcie zespołu lub biura' }),
          zone('okl-logo', 'miniatura', 12, 20, 60, 40, { opis: 'Logo firmy (PNG z przezroczystością)', wymagane: false }),
        ],
        elementyTekstowe: [
          { id: 'firma', tekst: '{nazwaFirmy}', pozycja: { x: 80, y: 30 }, rozmiar: 18 },
          { id: 'rok', tekst: 'Kalendarz {rok}', pozycja: { x: 80, y: 48 }, rozmiar: 12 },
          { id: 'kontakt', tekst: '{adresKontaktowy}', pozycja: { x: 12, y: 250 }, rozmiar: 8 },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'corporate-clean',
        strefyMiesiac: () => [
          zone(`m${i + 1}-firm`, 'pasek', 12, 42, 186, 48, { opis: `Zdjęcie firmowe — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 18, waga: 'semibold' } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL11() {
  const strefaKal = { x: 12, y: 145, szerokosc: 186, wysokosc: 140 };
  return {
    ...KALENDARIA[10],
    tagi: ['akwarela', 'art', 'organiczny'],
    paleta: { tlo: '#FDFCF8', akcent: '#9B59B6', tekst: '#4A235A', plama1: '#85C1E9', plama2: '#F1948A' },
    typografia: { naglowek: 'Dancing Script', tekst: 'Crimson Text', rozmiarMiesiac: 30, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'watercolor-organic',
        strefyZdjec: [
          zone('okl-art', 'organiczny', 35, 55, 140, 155, { opis: 'Zdjęcie w organicznej masce akwarelowej', maska: 'blob-01' }),
        ],
        dekoracje: [
          { typ: 'plama-akwarelowa', kolor: '#85C1E9', pozycja: { x: 10, y: 30 }, przezroczystosc: 0.4 },
          { typ: 'plama-akwarelowa', kolor: '#F1948A', pozycja: { x: 140, y: 180 }, przezroczystosc: 0.35 },
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: '{rok}', pozycja: { x: 105, y: 240 }, rozmiar: 40, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'watercolor-photo-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-art`, 'organiczny', 48, 38, 114, 95, {
            opis: `Zdjęcie artystyczne — ${m}`,
            maska: `blob-0${(i % 5) + 1}`,
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 26, styl: 'kursywa' } },
        dekoracjeMiesiac: (mn) => [{ typ: 'plama-akwarelowa', kolor: ['#85C1E9', '#F1948A', '#82E0AA', '#F9E79F'][(mn - 1) % 4] }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL12() {
  const strefaKal = { x: 12, y: 125, szerokosc: 186, wysokosc: 160 };
  return {
    ...KALENDARIA[11],
    tagi: ['loft', 'industrialny', 'miejski'],
    paleta: { tlo: '#2C2C2C', akcent: '#C9A96E', tekst: '#E8E8E8', metal: '#8B8B8B' },
    typografia: { naglowek: 'Barlow Condensed', tekst: 'Barlow', rozmiarMiesiac: 28, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'industrial-frame',
        strefyZdjec: [
          zone('okl-loft', 'ramka', 22, 45, 166, 175, {
            opis: 'Zdjęcie miejskie/loftowe w metalowej ramie',
            ramka: { styl: 'industrial-metal', szerokosc: 3, kolor: '#C9A96E' },
          }),
        ],
        dekoracje: [{ typ: 'tekstura', motyw: 'beton', obszar: { x: 0, y: 0, szerokosc: 210, wysokosc: 297 }, przezroczystosc: 0.15 }],
        elementyTekstowe: [
          { id: 'tytul', tekst: '{rok}', pozycja: { x: 105, y: 255 }, rozmiar: 36, wyrownanie: 'center', kolor: '#C9A96E' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'industrial-strip',
        strefyMiesiac: () => [
          zone(`m${i + 1}-loft`, 'ramka', 12, 40, 186, 72, {
            opis: `Zdjęcie loft — ${m}`,
            ramka: { styl: 'industrial-metal', szerokosc: 2, kolor: '#C9A96E' },
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 24, kolor: '#C9A96E' } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL13() {
  const strefaKal = { x: 12, y: 135, szerokosc: 186, wysokosc: 150 };
  return {
    ...KALENDARIA[12],
    tagi: ['ślub', 'romantyczny', 'okolicznościowy'],
    paleta: { tlo: '#FFF9F5', akcent: '#D4AF37', tekst: '#5C4033', roz: '#F8E8E0' },
    typografia: { naglowek: 'Great Vibes', tekst: 'Raleway', rozmiarMiesiac: 28, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'wedding-elegant',
        strefyZdjec: [
          zone('okl-para', 'hero', 25, 55, 160, 175, { opis: 'Zdjęcie pary młodej lub rocznicowe' }),
        ],
        dekoracje: [
          { typ: 'ornament', motyw: 'kwiatowy-gora', pozycja: { x: 55, y: 15 } },
          { typ: 'ornament', motyw: 'kwiatowy-dol', pozycja: { x: 55, y: 250 } },
        ],
        elementyTekstowe: [
          { id: 'imiona', tekst: '{imie1} & {imie2}', pozycja: { x: 105, y: 38 }, rozmiar: 32, wyrownanie: 'center' },
          { id: 'rok', tekst: '{rok}', pozycja: { x: 105, y: 248 }, rozmiar: 20, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'wedding-photo-grid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-wes`, 'hero', 40, 40, 130, 82, { opis: `Zdjęcie para/rodzina — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 24, styl: 'kursywa' } },
        dekoracjeMiesiac: () => [{ typ: 'linia-zlota', pozycja: { x: 12, y: 130 }, szerokosc: 186 }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL14() {
  const strefaKal = { x: 12, y: 110, szerokosc: 186, wysokosc: 175 };
  return {
    ...KALENDARIA[13],
    tagi: ['podróże', 'mapa', 'adventure'],
    paleta: { tlo: '#F5F0E8', akcent: '#C1440E', tekst: '#2C1810', mapa: '#D4C5A9' },
    typografia: { naglowek: 'Abril Fatface', tekst: 'Merriweather', rozmiarMiesiac: 24, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'travel-map',
        strefyZdjec: [
          zone('okl-podroz', 'hero', 12, 70, 186, 150, { opis: 'Zdjęcie z podróży — krajobraz' }),
        ],
        dekoracje: [
          { typ: 'ilustracja', motyw: 'kompas', pozycja: { x: 155, y: 20 }, rozmiar: 40 },
          { typ: 'ilustracja', motyw: 'znacznik-mapa', pozycja: { x: 20, y: 250 } },
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Adventure {rok}', pozycja: { x: 105, y: 40 }, rozmiar: 30, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'travel-postcard',
        strefyMiesiac: () => [
          zone(`m${i + 1}-travel`, 'ramka', 12, 38, 186, 62, {
            opis: `Pocztówka z podróży — ${m}`,
            ramka: { styl: 'postcard', szerokosc: 1, kolor: '#D4C5A9' },
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 22 } },
        dekoracjeMiesiac: (mn) => [{ typ: 'znacznik-miesiac', miesiac: mn, pozycja: { x: 170, y: 18 } }],
      }, i + 1, m)),
    ],
  };
}

function buildKAL15() {
  const sezony = [
    { miesiace: [1, 2, 3], nazwa: 'zima', paleta: { tlo: '#E8F4F8', akcent: '#4A90D9' } },
    { miesiace: [4, 5, 6], nazwa: 'wiosna', paleta: { tlo: '#F0F8E8', akcent: '#6B8E23' } },
    { miesiace: [7, 8, 9], nazwa: 'lato', paleta: { tlo: '#FFF8E8', akcent: '#E8A317' } },
    { miesiace: [10, 11, 12], nazwa: 'jesien', paleta: { tlo: '#F8F0E8', akcent: '#C1440E' } },
  ];
  const getSezon = (m) => sezony.find((s) => s.miesiace.includes(m));
  const strefaKal = { x: 12, y: 125, szerokosc: 186, wysokosc: 160 };

  return {
    ...KALENDARIA[14],
    tagi: ['sezonowy', 'pory-roku', 'dynamiczny'],
    paleta: { tlo: 'dynamiczna', akcent: 'dynamiczny', tekst: '#333333' },
    typografia: { naglowek: 'Libre Baskerville', tekst: 'Libre Franklin', rozmiarMiesiac: 24, rozmiarDzien: 9 },
    sezony,
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'seasonal-quarters',
        strefyZdjec: sezony.map((s, idx) => zone(`okl-${s.nazwa}`, 'kolaż', 12 + (idx % 2) * 93, 50 + Math.floor(idx / 2) * 95, 90, 90, {
          opis: `Zdjęcie — pora roku: ${s.nazwa}`,
        })),
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Cztery Pory Roku {rok}', pozycja: { x: 105, y: 28 }, rozmiar: 22, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => {
        const mn = i + 1;
        const sez = getSezon(mn);
        return monthPage({
          ukladMiesiac: 'seasonal-adaptive',
          strefyMiesiac: () => [
            zone(`m${mn}-sez`, 'hero', 12, 40, 186, 72, { opis: `Zdjęcie sezonowe (${sez.nazwa}) — ${m}` }),
          ],
          strefaKalendarza: strefaKal,
          typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 22 } },
          dekoracjeMiesiac: () => [
            { typ: 'motyw-sezonowy', sezon: sez.nazwa },
            { typ: 'paleta-sezonowa', ...sez.paleta },
          ],
        }, mn, m);
      }),
    ],
  };
}

function buildKAL16() {
  const strefaKal = { x: 12, y: 120, szerokosc: 186, wysokosc: 165 };
  const miniPolaroid = (idx, m) => zone(`mini-p${idx}`, 'polaroid', 12 + (idx % 6) * 31, 200 + Math.floor(idx / 6) * 38, 28, 34, {
    opis: `Mini Polaroid — ${m}`,
    ramka: { szerokosc: 2, kolor: '#FFF', marginesDolny: 6 },
    wymagane: false,
  });

  return {
    ...KALENDARIA[15],
    tagi: ['timeline', 'polaroid', '12-miesiecy'],
    paleta: { tlo: '#F8F8F8', akcent: '#333333', tekst: '#222222', ramka: '#FFFFFF' },
    typografia: { naglowek: 'Special Elite', tekst: 'Karla', rozmiarMiesiac: 20, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'timeline-12-polaroids',
        strefyZdjec: [
          zone('okl-glowne', 'hero', 30, 30, 150, 155, { opis: 'Główne zdjęcie okładkowe' }),
          ...MIESIACE.map((m, i) => miniPolaroid(i, m)),
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Rok w Obrazkach {rok}', pozycja: { x: 105, y: 12 }, rozmiar: 18, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'single-large-polaroid',
        strefyMiesiac: () => [
          zone(`m${i + 1}-bigpol`, 'polaroid', 46, 36, 118, 72, {
            opis: `Duży Polaroid miesiąca — ${m}`,
            ramka: { szerokosc: 5, kolor: '#FFF', marginesDolny: 14 },
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 20 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL17() {
  const strefaKal = { x: 108, y: 12, szerokosc: 90, wysokosc: 273 };
  return {
    ...KALENDARIA[16],
    tagi: ['split', 'nowoczesny', '50-50'],
    paleta: { tlo: '#FFFFFF', akcent: '#2563EB', tekst: '#1E293B', separator: '#E2E8F0' },
    typografia: { naglowek: 'Space Grotesk', tekst: 'DM Sans', rozmiarMiesiac: 18, rozmiarDzien: 8 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'split-vertical',
        strefyZdjec: [
          zone('okl-lewo', 'kolumna', 0, 0, 105, 297, { opis: 'Lewa połowa — pełne zdjęcie okładkowe' }),
        ],
        elementyTekstowe: [
          { id: 'rok', tekst: '{rok}', pozycja: { x: 157, y: 130 }, rozmiar: 48, wyrownanie: 'center' },
          { id: 'tytul', tekst: 'Kalendarz', pozycja: { x: 157, y: 175 }, rozmiar: 14, wyrownanie: 'center' },
        ],
        separator: { x: 105, y: 0, szerokosc: 1, wysokosc: 297, kolor: '#E2E8F0' },
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'split-photo-calendar',
        strefyMiesiac: () => [
          zone(`m${i + 1}-split`, 'kolumna', 0, 0, 102, 297, { opis: `Pełna wysokość zdjęcie — ${m}` }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 108, y: 18, rozmiar: 16, transform: 'uppercase' } },
        separator: { x: 105, y: 0, szerokosc: 1, wysokosc: 297 },
      }, i + 1, m)),
    ],
  };
}

function buildKAL18() {
  const strefaKal = { x: 12, y: 12, szerokosc: 186, wysokosc: 273, uklad: 'radialny' };
  return {
    ...KALENDARIA[17],
    tagi: ['radialny', 'designerski', 'okrągły'],
    paleta: { tlo: '#FAFAFA', akcent: '#7C3AED', tekst: '#1F2937', okrag: '#EDE9FE' },
    typografia: { naglowek: 'Outfit', tekst: 'Outfit', rozmiarMiesiac: 16, rozmiarDzien: 8 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'radial-cover',
        strefyZdjec: [
          zone('okl-center', 'okrag', 45, 60, 120, 120, { opis: 'Centralne okrągłe zdjęcie okładkowe', maska: 'okrag' }),
        ],
        dekoracje: [
          { typ: 'pierścienie', pozycja: { x: 105, y: 120 }, promienie: [65, 80, 95], kolor: '#7C3AED' },
        ],
        elementyTekstowe: [
          { id: 'rok', tekst: '{rok}', pozycja: { x: 105, y: 220 }, rozmiar: 36, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'radial-days-around-photo',
        strefyMiesiac: () => [
          zone(`m${i + 1}-rad`, 'okrag', 65, 78, 80, 80, { opis: `Centralne zdjęcie — ${m}`, maska: 'okrag' }),
        ],
        strefaKalendarza: {
          ...strefaKal,
          srodek: { x: 105, y: 118 },
          promienDni: 55,
          promienZewn: 120,
        },
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 18 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL19() {
  const strefaKal = { x: 12, y: 168, szerokosc: 186, wysokosc: 117 };
  return {
    ...KALENDARIA[18],
    tagi: ['mozaika', 'kolaż', 'wspomnienia'],
    paleta: { tlo: '#FFFFFF', akcent: '#EC4899', tekst: '#374151', szczelina: 2 },
    typografia: { naglowek: 'Poppins', tekst: 'Poppins', rozmiarMiesiac: 18, rozmiarDzien: 8 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'mosaic-9-grid',
        strefyZdjec: Array.from({ length: 9 }, (_, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          return zone(`okl-m${idx}`, 'kolaż', 12 + col * 62, 40 + row * 62, 60, 60, {
            opis: `Mozaika okładki — zdjęcie ${idx + 1}`,
            szczelina: 2,
          });
        }),
        elementyTekstowe: [
          { id: 'tytul', tekst: 'Mozaika Wspomnień {rok}', pozycja: { x: 105, y: 22 }, rozmiar: 18, wyrownanie: 'center' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'mosaic-6-top-grid-bottom',
        strefyMiesiac: () => Array.from({ length: 6 }, (_, idx) => {
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          return zone(`m${i + 1}-moz${idx}`, 'kolaż', 12 + col * 62, 40 + row * 52, 60, 50, {
            opis: `Mozaika ${idx + 1} — ${m}`,
            szczelina: 2,
          });
        }),
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 12, y: 18, rozmiar: 18 } },
      }, i + 1, m)),
    ],
  };
}

function buildKAL20() {
  const strefaKal = { x: 22, y: 155, szerokosc: 166, wysokosc: 125 };
  return {
    ...KALENDARIA[19],
    tagi: ['luksus', 'złoty', 'premium'],
    paleta: { tlo: '#0F172A', akcent: '#D4AF37', tekst: '#F8FAFC', ramka: '#D4AF37' },
    typografia: { naglowek: 'Cinzel', tekst: 'Montserrat', rozmiarMiesiac: 22, rozmiarDzien: 9 },
    strony: [
      {
        numer: 1, typ: 'okladka', etykieta: 'Okładka',
        uklad: 'luxury-gold-frame',
        strefyZdjec: [
          zone('okl-lux', 'ramka', 30, 55, 150, 175, {
            opis: 'Eleganckie zdjęcie w złotej ramie',
            ramka: { styl: 'ornament-gold', szerokosc: 4, kolor: '#D4AF37', podwojna: true },
          }),
        ],
        dekoracje: [
          { typ: 'ornament-narozniki', kolor: '#D4AF37', grubosc: 1.5 },
          { typ: 'linia-pozioma', pozycja: { x: 50, y: 260 }, szerokosc: 110, kolor: '#D4AF37' },
        ],
        elementyTekstowe: [
          { id: 'tytul', tekst: '{rok}', pozycja: { x: 105, y: 30 }, rozmiar: 42, wyrownanie: 'center', kolor: '#D4AF37' },
          { id: 'podtytul', tekst: 'Kalendarium+ Premium', pozycja: { x: 105, y: 275 }, rozmiar: 10, wyrownanie: 'center', kolor: '#D4AF37' },
        ],
      },
      ...MIESIACE.map((m, i) => monthPage({
        ukladMiesiac: 'luxury-centered-photo',
        strefyMiesiac: () => [
          zone(`m${i + 1}-lux`, 'ramka', 48, 38, 114, 100, {
            opis: `Zdjęcie premium — ${m}`,
            ramka: { styl: 'gold-simple', szerokosc: 2, kolor: '#D4AF37' },
          }),
        ],
        strefaKalendarza: strefaKal,
        typografiaMiesiac: { nazwaMiesiaca: { x: 105, y: 18, rozmiar: 20, wyrownanie: 'center', kolor: '#D4AF37' } },
        dekoracjeMiesiac: () => [{ typ: 'ramka-zewnetrzna', margines: 8, kolor: '#D4AF37', grubosc: 0.5 }],
      }, i + 1, m)),
    ],
  };
}

const builders = [
  buildKAL01, buildKAL02, buildKAL03, buildKAL04, buildKAL05,
  buildKAL06, buildKAL07, buildKAL08, buildKAL09, buildKAL10,
  buildKAL11, buildKAL12, buildKAL13, buildKAL14, buildKAL15,
  buildKAL16, buildKAL17, buildKAL18, buildKAL19, buildKAL20,
];

const plan = {
  meta: {
    wersja: '1.0.0',
    dataUtworzenia: '2026-06-14',
    projekt: 'Kalendarium+',
    opis: 'Szczegółowy plan 20 zróżnicowanych kalendarzy 13-stronicowych (okładka + 12 miesięcy), format A4 pion, ze strefami na zdjęcia klienta',
    jezyk: 'pl',
    walutaJednostek: 'mm',
    dpiZalecane: 300,
    liczbaSzablonow: 20,
    liczbaStron: 13,
    strukturaStron: STRUKTURA_STRON,
  },
  formatWspolny: {
    nazwa: 'A4 pion',
    szerokosc: 210,
    wysokosc: 297,
    orientacja: 'portrait',
    marginesy: { gora: 12, dol: 12, lewo: 12, prawo: 12 },
    obszarRoboczy: { x: 12, y: 12, szerokosc: 186, wysokosc: 273 },
    spad: 3,
    profilKolorow: 'CMYK',
    rozdzielczoscMin: 300,
    formatZdjec: ['JPEG', 'PNG', 'TIFF'],
    minRozdzielczoscZdjecia: { szerokoscPx: 1200, wysokoscPx: 1200 },
    siatkaDni: {
      kolumny: 7,
      wiersze: 6,
      etykietyDni: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
      pierwszyDzienTygodnia: 'poniedzialek',
      komorka: { szerokosc: 26.5, wysokosc: 20, odstep: 1 },
    },
    zmienneTekstowe: ['{rok}', '{nazwaFirmy}', '{imie1}', '{imie2}', '{adresKontaktowy}'],
  },
  typyStrefZdjec: {
    hero: 'Główne zdjęcie dominujące na stronie',
    tlo: 'Zdjęcie jako pełne tło strony (bleed)',
    miniatura: 'Małe zdjęcie akcentowe (logo, detal)',
    kolaż: 'Wiele zdjęć w układzie siatki lub mozaiki',
    ramka: 'Zdjęcie w ozdobnej ramce',
    pasek: 'Zdjęcie panoramiczne w poziomie',
    kolumna: 'Zdjęcie w pionowej kolumnie bocznej',
    polaroid: 'Zdjęcie w stylu odbitki Polaroid z marginesem dolnym',
    okrag: 'Zdjęcie w masce kołowej',
    organiczny: 'Zdjęcie w nieregularnym, artystycznym kształcie',
  },
  podsumowanieRoznicowania: {
    ukladyStron: [
      'hero-top-grid-bottom', 'fullscreen-background', 'grid-left-photo-right',
      'polaroid-scatter', 'asymmetric-split', 'collage-multi', 'botanical-column',
      'bw-strip', 'circle-photo', 'corporate-strip', 'watercolor-organic',
      'industrial-frame', 'wedding-elegant', 'travel-postcard', 'seasonal-adaptive',
      'timeline-polaroids', 'split-vertical-50-50', 'radial-around-photo', 'mosaic-grid', 'luxury-gold-frame',
    ],
    liczbaStrefZdjecNaStrone: { min: 1, max: 13, srednia: 3.2 },
    kategorieStylistyczne: [
      'klasyczny', 'artystyczny', 'minimal', 'retro', 'nowoczesny', 'rodzinny',
      'przyroda', 'fotograficzny', 'dzieciecy', 'biznes', 'miejski', 'okolicznosciowy',
      'podroze', 'sezonowy', 'kolaż', 'eksperymentalny', 'premium',
    ],
  },
  kalendaria: builders.map((fn) => fn()),
};

writeFileSync(OUT, JSON.stringify(plan, null, 2), 'utf-8');
console.log(`Wygenerowano: ${OUT}`);
console.log(`Kalendaria: ${plan.kalendaria.length}`);
console.log(`Stron na kalendarz: ${plan.meta.liczbaStron}`);
