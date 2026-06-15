import { useEffect, useMemo, useState } from 'react';
import plakatPlanData from '../../data/plan-kalendaria-plakat.json';
import artPlanData from '../../data/plan-kalendaria-art-40-60.json';
import classicPlanData from '../../data/plan-kalendaria-13s.json';
import pionPlanData from '../../data/plan-kalendaria-pionowe.json';
import planerPlanData from '../../data/plan-kalendaria-planery.json';
import seniorPlanData from '../../data/plan-kalendaria-senior.json';
import temPlanData from '../../data/plan-kalendaria-tematyczne.json';
import trojkaPlanData from '../../data/plan-kalendaria-trojka.json';
import type { Kalendarium, PlanKalendaria } from '../types/plan';
import type { PageFormat } from '../utils/previewUtils';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { PreviewGallery } from './PreviewGallery';

const plakatPlan = plakatPlanData as unknown as PlanKalendaria;
const artPlan = artPlanData as unknown as PlanKalendaria;
const temPlan = temPlanData as unknown as PlanKalendaria;
const pionPlan = pionPlanData as unknown as PlanKalendaria;
const planerPlan = planerPlanData as unknown as PlanKalendaria;
const seniorPlan = seniorPlanData as unknown as PlanKalendaria;
const trojkaPlan = trojkaPlanData as unknown as PlanKalendaria;
const classicPlan = classicPlanData as unknown as PlanKalendaria;

const portraitKalendaria: Kalendarium[] = [
  ...classicPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'klasyczne' as const })),
  ...artPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'art' as const })),
  ...temPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'tematyczne' as const })),
  ...pionPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'pionowe' as const })),
  ...planerPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'planery' as const })),
  ...seniorPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'senior' as const })),
  ...trojkaPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'trojka' as const })),
  ...plakatPlan.kalendaria.map((k) => ({ ...k, kolekcja: 'plakat' as const })),
];

const PORTRAIT_COUNT = portraitKalendaria.length;

const mergedPlan: PlanKalendaria = {
  meta: {
    ...artPlan.meta,
    liczbaSzablonow: PORTRAIT_COUNT,
    opis: `${PORTRAIT_COUNT} kalendarzy pionowych A4/A3 — klasyczne · art · tematyczne · pionowe · planery · senior · trzy kalendarze · plakat 1 karta`,
  },
  formatWspolny: artPlan.formatWspolny,
  kalendaria: portraitKalendaria,
};

type KolekcjaFilter = '' | 'klasyczne' | 'art' | 'tematyczne' | 'pionowe' | 'planery' | 'senior' | 'trojka' | 'plakat';

const KOLEKCJA_LABELS: Record<KolekcjaFilter, string> = {
  '': `Wszystkie (${PORTRAIT_COUNT})`,
  klasyczne: 'Klasyczne (20)',
  art: 'Art (30)',
  tematyczne: 'Tematyczne (19)',
  pionowe: 'Pionowe (4)',
  planery: 'Planery (20)',
  senior: 'Babcia i dziadek (10)',
  trojka: 'Trzy kalendarze (7)',
  plakat: 'Plakat 1 karta (30)',
};

export function KreatorPionPreviewPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [kolekcja, setKolekcja] = useState<KolekcjaFilter>('');
  const [pageFormat, setPageFormat] = useState<PageFormat>('A4');

  const fonts = useMemo(() => collectFontsFromPlan(portraitKalendaria), []);

  const filteredPlan = useMemo(() => ({
    ...mergedPlan,
    kalendaria: kolekcja
      ? portraitKalendaria.filter((k) => k.kolekcja === kolekcja)
      : portraitKalendaria,
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
      title="KREATOR PION A4,A3 —"
      subtitle={`${filteredPlan.kalendaria.length} kalendarzy pion · format ${pageFormat} · klasyczne · art · plakat 1 karta · …`}
      showProportion
      showLayoutZones={showZones}
      fontsReady={fontsReady}
      pageFormat={pageFormat}
      extraControls={
        <>
          <label>
            Format
            <select
              value={pageFormat}
              onChange={(e) => setPageFormat(e.target.value as PageFormat)}
            >
              <option value="A4">A4 pion (210×297 mm)</option>
              <option value="A3">A3 pion (297×420 mm)</option>
            </select>
          </label>
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
        { href: '/art', label: '← Poziome A4 (13)' },
        { href: '/podglad', label: 'Klasyczne' },
        { href: '/kreator-pion.html', label: 'Wersja bezpośrednia' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
