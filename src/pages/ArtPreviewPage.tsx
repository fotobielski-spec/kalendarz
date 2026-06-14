import { useEffect, useMemo, useState } from 'react';
import planData from '../../data/plan-kalendaria-art-40-60.json';
import type { PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { PreviewGallery } from './PreviewGallery';

const plan = planData as PlanKalendaria;

export function ArtPreviewPage() {
  const [fontsReady, setFontsReady] = useState(false);
  const [showZones, setShowZones] = useState(true);

  const fonts = useMemo(() => collectFontsFromPlan(plan.kalendaria), []);

  useEffect(() => {
    loadGoogleFonts(fonts);
    document.fonts?.ready?.then(() => setFontsReady(true));
    const t = setTimeout(() => setFontsReady(true), 1200);
    return () => clearTimeout(t);
  }, [fonts]);

  return (
    <PreviewGallery
      plan={plan}
      title="Typografia & Układy —"
      subtitle="30 kalendarzy A4 · 60% zdjęcie · 40% kalendarium · prawdziwe czcionki Google Fonts"
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
        { href: '/?view=podglad', label: '← Klasyczne (20)' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
