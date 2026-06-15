import type { Kalendarium } from '../types/plan';

/** Pełny obiekt motywu (szablonu) jako sformatowany JSON. */
export function themeJsonString(kalendarium: Kalendarium): string {
  return JSON.stringify(kalendarium, null, 2);
}

export async function copyThemeJson(kalendarium: Kalendarium): Promise<void> {
  const text = themeJsonString(kalendarium);
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  if (!ok) throw new Error('copy failed');
}
