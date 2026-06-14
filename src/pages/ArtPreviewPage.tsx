import { useEffect, useMemo, useState } from 'react';
import artPlanData from '../../data/plan-kalendaria-art-40-60.json';
import temPlanData from '../../data/plan-kalendaria-tematyczne.json';
import type { Kalendarium, PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { PreviewGallery } from './PreviewGallery';

const artPlan = artPlanData as unknown as PlanKalendaria;
const temPlan = temPlanData as unknown as PlanKalendaria;

const mergedKalendaria: Kalendarium[] = [
  ...artPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'art' as const })),
  ...temPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'tematyczne' as const })),
];

const mergedPlan: PlanKalendaria = {
  meta: {
    ...artPlan.meta,
    liczbaSzablonow: mergedKalendaria.length,
    opis: '50 kalendarzy A4 — 30 Art + 20 Tematyczne (koty, psy, OSP…)',
  },
  formatWspolny: artPlan.formatWspolny,
  kalendaria: mergedKalendaria,
};

type KolekcjaFilter = '' | 'art' | 'tematyczne';

export function ArtPreviewPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [kolekcja, setKolekcja] = useState<KolekcjaFilter>('');

  const fonts = useMemo(() => collectFontsFromPlan(mergedKalendaria), []);

  const filteredPlan = useMemo(() => ({
    ...mergedPlan,
    kalendaria: kolekcja
      ? mergedKalendaria.filter((k) => k.kolekcja === kolekcja)
      : mergedKalendaria,
  }), [kolekcja]);

  useEffect(() => {
    loadGoogleFonts(fonts);
    document.fonts?.ready?.then(() => setFontsReady(true));
    const t = setTimeout(() => setFontsReady(true), 1500);
    return () => clearTimeout(t);
  }, [fonts]);

  return (
    <PreviewGallery
      plan={filteredPlan}
      title="Typografia & Układy —"
      subtitle={`${filteredPlan.kalendaria.length} kalendarzy A4 · 60/40 · czcionki · imieniny · koty · psy · OSP`}
      showProportion
      showLayoutZones={showZones}
      fontsReady={fontsReady}
      extraControls={
        <>
          <label>
            Kolekcja
            <select
              value={kolekcja}
              onChange={(e) => setKolekcja(e.target.value as KolekcjaFilter)}
            >
              <option value="">Wszystkie (50)</option>
              <option value="art">Art (30)</option>
              <option value="tematyczne">Tematyczne (20)</option>
            </select>
          </label>
          <label className="preview-gallery__toggle">
            <input
              type="checkbox"
              checked={showZones}
              onChange={(e) => setShowZones(e.target.checked)}
            />
            Strefy układu
          </label>
        </>
      }
      links={[
        { href: '/?view=podglad', label: '← Klasyczne (20)' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
