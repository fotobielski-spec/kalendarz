export interface PozycjaMm {
  x: number;
  y: number;
  szerokosc: number;
  wysokosc: number;
}

export interface StrefaZdjecia {
  id: string;
  typStrefy: string;
  pozycja: PozycjaMm;
  proporcjeZalecane?: string;
  maska?: string;
  obrot?: number;
  przezroczystosc?: number;
  ramka?: {
    szerokosc?: number;
    kolor?: string;
    styl?: string;
    marginesDolny?: number;
    podwojna?: boolean;
  } | null;
  clipPath?: string | null;
  efekt?: string;
  opis?: string;
  wymagane?: boolean;
  szczelina?: number;
}

export interface StrefaKalendarza extends PozycjaMm {
  uklad?: string;
  krawedz?: 'lewo' | 'prawo';
  plannerTyp?: string;
  tripleTyp?: string;
  kalendarium?: boolean;
  przezroczysteTlo?: number;
  srodek?: { x: number; y: number };
  promienDni?: number;
  promienZewn?: number;
}

export interface StronaMiesiaca {
  numer: number;
  typ: 'miesiac';
  etykieta: string;
  miesiac: number;
  uklad: string;
  strefyZdjec: StrefaZdjecia[];
  strefaKalendarza: StrefaKalendarza;
  typografia?: {
    nazwaMiesiaca?: {
      x: number;
      y: number;
      rozmiar?: number;
      kolor?: string;
      wyrownanie?: string;
      transform?: string;
      letterSpacing?: number;
      styl?: string;
      waga?: string;
    };
  };
  dekoracje?: Dekoracja[];
  separator?: { x: number; y: number; szerokosc: number; wysokosc: number; kolor?: string };
  nakladka?: { kolor: string; obszar: PozycjaMm };
  efektyStrony?: { frostedGlass?: boolean; panelPolprzezroczysty?: boolean; nakladkaZaluzja?: boolean };
  proporcja?: { kalendarium: number; zdjecie: number };
}

export interface Dekoracja {
  typ: string;
  kolor?: string;
  pozycja?: PozycjaMm | { x: number; y: number };
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  szerokosc?: number;
  wysokosc?: number;
  grubosc?: number;
  obszar?: PozycjaMm;
  sezon?: string;
  tlo?: string;
  akcent?: string;
  promienie?: number[];
  promien?: number;
  rozmiar?: number;
  margines?: number;
  paski?: number;
  od?: string;
  do?: string;
}

export interface Paleta {
  tlo?: string;
  akcent?: string;
  tekst?: string;
  drugi?: string;
  trzeci?: string;
  nakladka?: string;
  separator?: string;
  ramka?: string;
  roz?: string;
  szary?: string;
  metal?: string;
  mapa?: string;
  okrag?: string;
  linia?: string;
  kwiat?: string;
  plama1?: string;
  plama2?: string;
  szczelina?: number;
}

export interface Kalendarium {
  id: string;
  nazwa: string;
  kategoria: string;
  opis: string;
  tagi?: string[];
  paleta: Paleta;
  typografia: {
    naglowek?: string;
    tekst?: string;
    rozmiarMiesiac?: number;
    rozmiarDzien?: number;
    senior?: boolean;
    /** Kompaktowa siatka — mniejsze cyfry, krótsze imieniny (SEN-04+) */
    dense?: boolean;
    /** Tryb trzech kalendarzy na karcie */
    trojka?: boolean;
  };
  efekty?: { zdjecia?: string; kontrast?: number };
  proporcja?: { kalendarium: number; zdjecie: number };
  kolekcja?: 'art' | 'tematyczne' | 'pionowe' | 'planery' | 'senior' | 'trojka' | string;
  strony: StronaMiesiaca[];
}

export interface PlanKalendaria {
  meta: { rokDomyslny?: number; liczbaSzablonow?: number; opis?: string };
  formatWspolny: {
    szerokosc?: number;
    wysokosc?: number;
    siatkaDni?: { etykietyDni: string[] };
    proporcja?: { kalendarium: number; zdjecie: number };
    imieniny?: boolean;
  };
  kalendaria: Kalendarium[];
}
