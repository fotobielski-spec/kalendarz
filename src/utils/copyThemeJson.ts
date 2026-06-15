import type { Kalendarium } from '../types/plan';
import { exportThemeJsonString } from './exportThemeSchema';
import type { PageFormat } from './previewUtils';

/** Motyw w formacie schema_version 1 (kompatybilny z zewnętrznym kreatorem). */
export function themeJsonString(kalendarium: Kalendarium, pageFormat: PageFormat = 'A4'): string {
  return exportThemeJsonString(kalendarium, pageFormat);
}

export async function copyThemeJson(
  kalendarium: Kalendarium,
  pageFormat: PageFormat = 'A4',
): Promise<void> {
  const text = themeJsonString(kalendarium, pageFormat);
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
