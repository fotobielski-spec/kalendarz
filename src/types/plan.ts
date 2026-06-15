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
  siatkaKolumny?: number;
  siatkaWiersze?: number;
  odstepMm?: number;
  bezImienin?: boolean;
  kompaktowy?: boolean;
}

export interface StronaRoczna {
  numer: number;
  typ: 'rok';
  etykieta: string;
  uklad: string;
  strefyZdjec: StrefaZdjecia[];
  strefaKalendarza: StrefaKalendarza;
  typografia?: {
    tytulRoczny?: {
      x: number;
      y: number;
      szerokosc: number;
      wysokosc: number;
      tekst?: string;
      rozmiar?: number;
      kolor?: string;
      wyrownanie?: string;
      transform?: string;
      letterSpacing?: number;
      waga?: string;
    };
  };
  dekoracje?: Dekoracja[];
  efektyStrony?: { frostedGlass?: boolean; panelPolprzezroczysty?: boolean; nakladkaZaluzja?: boolean };
  proporcja?: { kalendarium: number; zdjecie: number };
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
    /** Kalendarz roczny na 1 karcie */
    roczny?: boolean;
  };
  orientacja?: 'portrait' | 'landscape';
  efekty?: { zdjecia?: string; kontrast?: number };
  proporcja?: { kalendarium: number; zdjecie: number };
  kolekcja?: 'klasyczne' | 'art' | 'tematyczne' | 'pionowe' | 'planery' | 'senior' | 'trojka' | 'poziome' | 'plakat' | string;
  strony: (StronaMiesiaca | StronaRoczna)[];
}

export interface PlanKalendaria {
  meta: { rokDomyslny?: number; liczbaSzablonow?: number; opis?: string };
  formatWspolny: {
    nazwa?: string;
    szerokosc?: number;
    wysokosc?: number;
    orientacja?: 'portrait' | 'landscape';
    siatkaDni?: { etykietyDni: string[] };
    proporcja?: { kalendarium: number; zdjecie: number };
    imieniny?: boolean;
  };
  kalendaria: Kalendarium[];
}
