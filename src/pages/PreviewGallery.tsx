import { useEffect, useMemo, useState } from 'react';
import type { PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import { MonthPagePreview } from '../components/preview/MonthPagePreview';
import './PreviewGallery.css';

interface PreviewGalleryProps {
  plan: PlanKalendaria;
  title: string;
  subtitle: string;
  showProportion?: boolean;
  showLayoutZones?: boolean;
  fontsReady?: boolean;
  extraControls?: React.ReactNode;
  links?: { href: string; label: string }[];
}

export function PreviewGallery({
  plan,
  title,
  subtitle,
  showProportion = false,
  showLayoutZones = false,
  fontsReady = true,
  extraControls,
  links = [{ href: '/', label: '← Aplikacja' }],
}: PreviewGalleryProps) {
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');

  const categories = useMemo(
    () => [...new Set(plan.kalendaria.map((k) => k.kategoria))].sort(),
    [plan],
  );

  useEffect(() => {
    loadGoogleFonts(collectFontsFromPlan(plan.kalendaria));
  }, [plan]);

  const filtered = plan.kalendaria.filter((k) => {
    if (selected && k.id !== selected) return false;
    if (category && k.kategoria !== category) return false;
    return true;
  });

  const total = plan.kalendaria.length;

  return (
    <div className={`preview-gallery${fontsReady ? '' : ' preview-gallery--loading'}`}>
      <header className="preview-gallery__header">
        <div>
          <h1>
            {title} <span>Kalendarium+</span>
          </h1>
          <p>{subtitle}</p>
        </div>
        <div className="preview-gallery__controls">
          <label>
            Rok
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
          <label>
            Kategoria
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Wszystkie</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Szablon
            <select value={selected ?? ''} onChange={(e) => setSelected(e.target.value || null)}>
              <option value="">Wszystkie ({total})</option>
              {plan.kalendaria.map((k) => (
                <option key={k.id} value={k.id}>{k.id} — {k.nazwa}</option>
              ))}
            </select>
          </label>
          {extraControls}
          {links.map((l) => (
            <a key={l.href} href={l.href} className="preview-gallery__link">{l.label}</a>
          ))}
        </div>
      </header>

      {!fontsReady && (
        <p className="preview-gallery__loading">Ładowanie czcionek…</p>
      )}

      <div className={`preview-gallery__grid${selected ? ' preview-gallery__grid--single' : ''}`}>
        {filtered.map((k) => (
          <MonthPagePreview
            key={k.id}
            kalendarium={k}
            year={year}
            scale={selected ? 1.2 : 1}
            showProportion={showProportion}
            showLayoutZones={showLayoutZones}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="preview-gallery__empty">Brak szablonów dla wybranych filtrów.</p>
      )}
    </div>
  );
}
