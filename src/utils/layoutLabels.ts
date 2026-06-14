/** Polskie etykiety układów strony miesięcznej */

export const UKLAD_LABELS: Record<string, string> = {
  'photo-top-60': 'Zdjęcie góra 60%',
  'photo-left-60': 'Zdjęcie lewo 60%',
  'photo-right-60': 'Zdjęcie prawo 60%',
  'diagonal-top-60': 'Przekątna góra 60%',
  'L-frame-60': 'Rama L — 60% foto',
  'cal-top-photo-bottom-60': 'Kalendarz góra · foto dół 60%',
  'circle-photo-top-60': 'Okrągłe foto góra 60%',
  'filmstrip-top-60': 'Pasek filmowy 60%',
  'vogue-left-60': 'Vogue — lewo 60%',
  'polaroid-stack-60': 'Stos Polaroid 60%',
  'arch-top-60': 'Łuk katedralny 60%',
  'blinds-top-60': 'Żaluzja światła 60%',
  'gradient-fade-60': 'Gradient mglisty 60%',
  'double-exposure-60': 'Podwójna ekspozycja 60%',
  'zen-offset-60': 'Zen — asymetria 60%',
  'deco-frame-60': 'Art Deco rama 60%',
  'watercolor-60': 'Akwarela organiczna 60%',
  'hexagon-top-60': 'Heksagon góra 60%',
  'frosted-top-60': 'Szkło matowe 60%',
  'spiral-golden-60': 'Złota spirala 60%',
  'duet-top-60': 'Duet 2 zdjęć 60%',
  'torn-edge-60': 'Podarta krawędź 60%',
  'neon-top-60': 'Neon noc 60%',
  'wreath-top-60': 'Wieniec botaniczny 60%',
  'nordic-top-60': 'Nordycki minimal 60%',
  'brutalist-top-60': 'Brutalizm 60%',
  'storyboard-top-60': 'Storyboard 4K 60%',
  'wave-divider-60': 'Fala oceanu 60%',
  'origami-top-60': 'Origami fold 60%',
  'imperial-top-60': 'Imperial luxury 60%',
  'photo-top-grid-bottom': 'Foto góra + siatka',
  'fullscreen-with-overlay-grid': 'Pełne tło + nakładka',
  'grid-left-photo-right': 'Siatka lewo · foto prawo',
  'split-photo-calendar': 'Split 50/50',
  'radial-days-around-photo': 'Układ radialny',
  'tem-koty-top': 'Koty — foto góra 60%',
  'tem-psy-left': 'Psy — foto lewo 60%',
  'tem-osp-top': 'OSP — foto góra 60%',
  'tem-koty-circle': 'Koty — okrągłe foto',
  'tem-psy-right': 'Psy — foto prawo 60%',
  'tem-osp-landscape': 'OSP — panorama remizy',
  'tem-konie-top': 'Konie — foto góra',
  'tem-moto-top': 'Motocykle — foto góra',
  'tem-sport-top': 'Sport — foto góra',
  'tem-muzyka-top': 'Muzyka — foto góra',
  'tem-wedka-top': 'Wędkarstwo — foto góra',
  'tem-koty-duet': 'Koty — duet zdjęć',
  'tem-psy-polaroid': 'Psy — Polaroidy',
  'tem-osp-action': 'OSP — akcja',
  'tem-akwarium-top': 'Akwarium — foto góra',
  'tem-rower-top': 'Rower — foto góra',
  'tem-zamki-top': 'Zamki — foto góra',
  'tem-foto-left': 'Foto — lewo 60%',
  'tem-kuchnia-top': 'Kuchnia — foto góra',
  'tem-osp-mlodziez': 'OSP młodzieżowa',
  'pion-lista-lewo': 'Pionowa lista — lewy brzeg',
  'pion-lista-prawo': 'Pionowa lista — prawy brzeg',
  'pion-lista-bottom-lewo': 'Pionowa lista — dół lewo',
  'pion-lista-bottom-prawo': 'Pionowa lista — dół prawo',
  'pion-lista-overlay-prawo': 'Pionowa lista — nakładka prawo',
  'planer-foto-top': 'Planer — foto góra 60%',
  'planer-foto-left': 'Planer — foto lewo 60%',
  'planer-foto-right': 'Planer — foto prawo 60%',
  'senior-foto-top': 'Senior — foto góra · duże cyfry',
  'senior-kontrast': 'Senior — kontrast MAX',
  'senior-zolty': 'Senior — żółto-czarny',
};

export function getUkladLabel(uklad: string): string {
  return UKLAD_LABELS[uklad] ?? uklad.replace(/-/g, ' ');
}

export type LayoutOrientation = 'vertical-top' | 'vertical-bottom' | 'horizontal-left' | 'horizontal-right' | 'composite' | 'special';

export function getLayoutOrientation(uklad: string): LayoutOrientation {
  if (uklad.startsWith('pion-lista')) return 'horizontal-left';
  if (uklad.startsWith('planer-foto-left')) return 'horizontal-left';
  if (uklad.startsWith('planer-foto-right')) return 'horizontal-right';
  if (uklad.startsWith('planer-foto-top')) return 'vertical-top';
  if (uklad.startsWith('senior-')) return 'vertical-top';
  if (uklad.includes('left') || uklad === 'vogue-left-60') return 'horizontal-left';
  if (uklad.includes('bottom') || uklad === 'cal-top-photo-bottom-60') return 'vertical-bottom';
  if (uklad.includes('split')) return 'horizontal-left';
  if (uklad.includes('radial') || uklad.includes('L-frame') || uklad.includes('filmstrip') ||
      uklad.includes('polaroid') || uklad.includes('duet') || uklad.includes('storyboard') ||
      uklad.includes('double-exposure')) return 'composite';
  if (uklad.includes('top') || uklad.includes('frosted') || uklad.includes('imperial') ||
      uklad.includes('neon') || uklad.includes('gradient') || uklad.includes('blinds')) return 'vertical-top';
  return 'special';
}
