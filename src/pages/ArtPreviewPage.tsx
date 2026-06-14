import { useEffect, useMemo, useState } from 'react';
import artPlanData from '../../data/plan-kalendaria-art-40-60.json';
import pionPlanData from '../../data/plan-kalendaria-pionowe.json';
import planerPlanData from '../../data/plan-kalendaria-planery.json';
import seniorPlanData from '../../data/plan-kalendaria-senior.json';
import temPlanData from '../../data/plan-kalendaria-tematyczne.json';
import trojkaPlanData from '../../data/plan-kalendaria-trojka.json';
import type { Kalendarium, PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { PreviewGallery } from './PreviewGallery';

const artPlan = artPlanData as unknown as PlanKalendaria;
const temPlan = temPlanData as unknown as PlanKalendaria;
const pionPlan = pionPlanData as unknown as PlanKalendaria;
const planerPlan = planerPlanData as unknown as PlanKalendaria;
const seniorPlan = seniorPlanData as unknown as PlanKalendaria;
const trojkaPlan = trojkaPlanData as unknown as PlanKalendaria;

const mergedKalendaria: Kalendarium[] = [
  ...artPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'art' as const })),
  ...temPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'tematyczne' as const })),
  ...pionPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'pionowe' as const })),
  ...planerPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'planery' as const })),
  ...seniorPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'senior' as const })),
  ...trojkaPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'trojka' as const })),
];

const mergedPlan: PlanKalendaria = {
  meta: {
    ...artPlan.meta,
    liczbaSzablonow: mergedKalendaria.length,
    opis: '95 kalendarzy A4 — Art + Tematyczne + Pionowe + Planery + Senior + Trzy kalendarze',
  },
  formatWspolny: artPlan.formatWspolny,
  kalendaria: mergedKalendaria,
};

type KolekcjaFilter = '' | 'art' | 'tematyczne' | 'pionowe' | 'planery' | 'senior' | 'trojka';

const KOLEKCJA_LABELS: Record<KolekcjaFilter, string> = {
  '': 'Wszystkie (95)',
  art: 'Art (30)',
  tematyczne: 'Tematyczne (20)',
  pionowe: 'Pionowe (5)',
  planery: 'Planery (20)',
  senior: 'Babcia i dziadek (10)',
  trojka: 'Trzy kalendarze (10)',
};

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
      subtitle={`${filteredPlan.kalendaria.length} kalendarzy A4 · art · tematyczne · pionowe · planery · senior · trzy kalendarze`}
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
              {(Object.keys(KOLEKCJA_LABELS) as KolekcjaFilter[]).map((key) => (
                <option key={key || 'all'} value={key}>{KOLEKCJA_LABELS[key]}</option>
              ))}
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
        { href: '/podglad-art.html', label: 'Wersja bezpośrednia' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
