import { useEffect, useMemo, useState } from 'react';
import pozPlanData from '../../data/plan-kalendaria-poziome.json';
import type { Kalendarium, PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { PreviewGallery } from './PreviewGallery';

const pozPlan = pozPlanData as unknown as PlanKalendaria;

const poziomeKalendaria: Kalendarium[] = pozPlan.kalendaria.map((k) => ({
  ...k,
  kolekcja: 'poziome' as const,
  orientacja: 'landscape' as const,
}));

const POZIOME_COUNT = poziomeKalendaria.length;

const mergedPlan: PlanKalendaria = {
  meta: {
    ...pozPlan.meta,
    liczbaSzablonow: POZIOME_COUNT,
    opis: `${POZIOME_COUNT} kalendarzy A4 poziom — 13-stronicowe`,
  },
  formatWspolny: pozPlan.formatWspolny,
  kalendaria: poziomeKalendaria,
};

export function ArtPreviewPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [showZones, setShowZones] = useState(false);

  const fonts = useMemo(() => collectFontsFromPlan(poziomeKalendaria), []);

  useEffect(() => {
    loadGoogleFonts(fonts);
    document.fonts?.ready?.then(() => setFontsReady(true));
    const t = setTimeout(() => setFontsReady(true), 1500);
    return () => clearTimeout(t);
  }, [fonts]);

  return (
    <PreviewGallery
      plan={mergedPlan}
      title="Poziome A4 —"
      subtitle={`${POZIOME_COUNT} kalendarzy A4 poziom · 13-stronicowe · pasek dolny i układy poziome`}
      showProportion
      showLayoutZones={showZones}
      fontsReady={fontsReady}
      extraControls={
        <label className="preview-gallery__toggle">
          <input
            type="checkbox"
            checked={showZones}
            onChange={(e) => setShowZones(e.target.checked)}
          />
          Strefy układu
        </label>
      }
      links={[
        { href: '/kreator-pion', label: '← KREATOR PION A4,A3' },
        { href: '/podglad-art.html', label: 'Wersja bezpośrednia' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
