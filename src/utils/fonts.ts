/** Mapowanie nazw czcionek → Google Fonts + fallbacki systemowe */

const GOOGLE_FAMILIES: Record<string, string> = {
  'Cormorant Garamond': 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  'Lato': 'Lato:wght@400;600;700',
  'Playfair Display': 'Playfair+Display:ital,wght@0,400;0,700;1,400',
  'Source Sans 3': 'Source+Sans+3:wght@400;600;700',
  'Montserrat': 'Montserrat:wght@400;600;700',
  'Open Sans': 'Open+Sans:wght@400;600;700',
  'Oswald': 'Oswald:wght@400;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Quicksand': 'Quicksand:wght@400;600;700',
  'Nunito': 'Nunito:wght@400;600;700',
  'Libre Baskerville': 'Libre+Baskerville:ital,wght@0,400;0,700;1,400',
  'Libre Franklin': 'Libre+Franklin:wght@400;600;700',
  'Italiana': 'Italiana',
  'Raleway': 'Raleway:wght@400;600;700',
  'Bebas Neue': 'Bebas+Neue',
  'Roboto Mono': 'Roboto+Mono:wght@400;600',
  'Libre Bodoni': 'Libre+Bodoni:ital,wght@0,400;0,700;1,400',
  'Pacifico': 'Pacifico',
  'Courier Prime': 'Courier+Prime:wght@400;700',
  'Cinzel': 'Cinzel:wght@400;600;700',
  'EB Garamond': 'EB+Garamond:ital,wght@0,400;0,600;1,400',
  'Archivo Black': 'Archivo+Black',
  'Work Sans': 'Work+Sans:wght@400;600;700',
  'Josefin Sans': 'Josefin+Sans:wght@400;600;700',
  'Mulish': 'Mulish:wght@400;600;700',
  'Abril Fatface': 'Abril+Fatface',
  'Noto Serif JP': 'Noto+Serif+JP:wght@400;600',
  'Noto Sans JP': 'Noto+Sans+JP:wght@400;600',
  'Poiret One': 'Poiret+One',
  'Dancing Script': 'Dancing+Script:wght@400;600;700',
  'Crimson Text': 'Crimson+Text:ital,wght@0,400;0,600;1,400',
  'Orbitron': 'Orbitron:wght@400;600;700',
  'Exo 2': 'Exo+2:wght@400;600;700',
  'Inter': 'Inter:wght@400;600;700',
  'DM Serif Display': 'DM+Serif+Display',
  'DM Sans': 'DM+Sans:wght@400;600;700',
  'Special Elite': 'Special+Elite',
  'Merriweather': 'Merriweather:wght@400;700',
  'Audiowide': 'Audiowide',
  'Rajdhani': 'Rajdhani:wght@400;600;700',
  'Barlow Condensed': 'Barlow+Condensed:wght@400;600;700',
  'Barlow': 'Barlow:wght@400;600;700',
  'Poppins': 'Poppins:wght@400;600;700',
  'Lobster Two': 'Lobster+Two:ital,wght@0,400;0,700;1,400',
  'Spectral': 'Spectral:ital,wght@0,400;0,600;1,400',
  'Fredoka': 'Fredoka:wght@400;600;700',
  'Baloo 2': 'Baloo+2:wght@400;600;700',
  'Comfortaa': 'Comfortaa:wght@400;600;700',
  'Anton': 'Anton',
  'Righteous': 'Righteous',
  'Teko': 'Teko:wght@400;600;700',
  'Space Mono': 'Space+Mono:wght@400;700',
  'Lobster': 'Lobster',
  'Bitter': 'Bitter:wght@400;600;700',
};

/** Czcionki niedostępne w Google Fonts → zamiennik */
const SUBSTITUTES: Record<string, string> = {
  'Bodoni Moda': 'Libre Bodoni',
  'SF Pro Display': 'Inter',
  'SF Pro Text': 'Inter',
  'Helvetica Neue': 'Inter',
  'Cinzel Decorative': 'Cinzel',
};

export function resolveFontName(name: string | undefined): string {
  if (!name) return 'Inter';
  return SUBSTITUTES[name] ?? name;
}

export function fontStack(name: string | undefined): string {
  const resolved = resolveFontName(name);
  return `"${resolved}", ${fallbackCategory(resolved)}`;
}

function fallbackCategory(name: string): string {
  const mono = ['Roboto Mono', 'Courier Prime', 'Special Elite'];
  const serif = [
    'Cormorant Garamond', 'Playfair Display', 'Libre Baskerville', 'Italiana',
    'EB Garamond', 'Libre Bodoni', 'Abril Fatface', 'Noto Serif JP',
    'Crimson Text', 'DM Serif Display', 'Merriweather', 'Spectral', 'Cinzel',
  ];
  if (mono.includes(name)) return 'monospace';
  if (serif.includes(name)) return 'Georgia, serif';
  return 'system-ui, sans-serif';
}

export function collectFontsFromPlan(kalendaria: { typografia: { naglowek?: string; tekst?: string } }[]): string[] {
  const set = new Set<string>();
  for (const k of kalendaria) {
    if (k.typografia.naglowek) set.add(resolveFontName(k.typografia.naglowek));
    if (k.typografia.tekst) set.add(resolveFontName(k.typografia.tekst));
  }
  return [...set];
}

let loadedKey = '';

export function loadGoogleFonts(fontNames: string[]): void {
  const families = fontNames
    .map((n) => GOOGLE_FAMILIES[n])
    .filter(Boolean);

  if (families.length === 0) return;

  const key = families.sort().join('|');
  if (key === loadedKey) return;
  loadedKey = key;

  const id = 'kalendarium-google-fonts';
  let link = document.getElementById(id) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;
}
