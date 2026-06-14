import { useState } from 'react';
import planData from '../../data/plan-kalendaria-13s.json';
import type { PlanKalendaria } from '../types/plan';
import { MonthPagePreview } from '../components/preview/MonthPagePreview';
import './PreviewGallery.css';

const plan = planData as PlanKalendaria;

export function PreviewGallery() {
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected
    ? plan.kalendaria.filter((k) => k.id === selected)
    : plan.kalendaria;

  return (
    <div className="preview-gallery">
      <header className="preview-gallery__header">
        <div>
          <h1>
            Podgląd stycznia — <span>Kalendarium+</span>
          </h1>
          <p>20 szablonów kalendarzy A4 pion · 1 miesiąc na stronę · ze zdjęciami klienta</p>
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
            Szablon
            <select value={selected ?? ''} onChange={(e) => setSelected(e.target.value || null)}>
              <option value="">Wszystkie (20)</option>
              {plan.kalendaria.map((k) => (
                <option key={k.id} value={k.id}>{k.id} — {k.nazwa}</option>
              ))}
            </select>
          </label>
          <a href="/" className="preview-gallery__link">← Aplikacja</a>
        </div>
      </header>

      <div className={`preview-gallery__grid${selected ? ' preview-gallery__grid--single' : ''}`}>
        {filtered.map((k) => (
          <MonthPagePreview key={k.id} kalendarium={k} year={year} scale={selected ? 1.15 : 1} />
        ))}
      </div>
    </div>
  );
}
