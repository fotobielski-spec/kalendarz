import { useEffect } from 'react';
import type { Kalendarium } from '../../types/plan';
import { getUkladLabel } from '../../utils/layoutLabels';
import type { PageFormat } from '../../utils/previewUtils';
import { MonthPagePreview } from './MonthPagePreview';
import './PreviewLightbox.css';

interface PreviewLightboxProps {
  kalendarium: Kalendarium;
  year: number;
  index: number;
  total: number;
  showProportion?: boolean;
  showLayoutZones?: boolean;
  pageFormat?: PageFormat;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PreviewLightbox({
  kalendarium,
  year,
  index,
  total,
  showProportion,
  showLayoutZones,
  pageFormat = 'A4',
  onClose,
  onPrev,
  onNext,
}: PreviewLightboxProps) {
  const page = kalendarium.strony.find((s) => s.typ === 'miesiac' && s.miesiac === 1);
  const layoutLabel = page ? getUkladLabel(page.uklad) : '';

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="preview-lightbox" role="dialog" aria-modal="true" aria-label={`Podgląd ${kalendarium.id}`}>
      <button type="button" className="preview-lightbox__backdrop" onClick={onClose} aria-label="Zamknij" />

      <div className="preview-lightbox__panel">
        <header className="preview-lightbox__header">
          <div className="preview-lightbox__title-block">
            <span className="preview-lightbox__id">{kalendarium.id}</span>
            <h2 className="preview-lightbox__name">{kalendarium.nazwa}</h2>
            <p className="preview-lightbox__meta">
              {layoutLabel}
              {kalendarium.kategoria && ` · ${kalendarium.kategoria}`}
              {' · '}
              {index + 1}/{total}
            </p>
          </div>
          <div className="preview-lightbox__actions">
            <button type="button" onClick={onPrev} disabled={index <= 0} aria-label="Poprzedni szablon">
              ←
            </button>
            <button type="button" onClick={onNext} disabled={index >= total - 1} aria-label="Następny szablon">
              →
            </button>
            <button type="button" className="preview-lightbox__close" onClick={onClose} aria-label="Zamknij">
              ✕
            </button>
          </div>
        </header>

        <div className="preview-lightbox__stage">
          <MonthPagePreview
            kalendarium={kalendarium}
            year={year}
            variant="focus"
            showProportion={showProportion}
            showLayoutZones={showLayoutZones}
            hideMeta
            pageFormat={pageFormat}
          />
        </div>

        <p className="preview-lightbox__hint">
          Strzałki ← → · Esc zamyka · Styczeń {year}
        </p>
      </div>
    </div>
  );
}
