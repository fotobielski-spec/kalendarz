import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PlanKalendaria } from '../types/plan';
import { collectFontsFromPlan, loadGoogleFonts } from '../utils/fonts';
import type { PageFormat } from '../utils/previewUtils';
import { MonthPagePreview } from '../components/preview/MonthPagePreview';
import { CopyThemeJsonButton } from '../components/preview/CopyThemeJsonButton';
import { PreviewLightbox } from '../components/preview/PreviewLightbox';
import './PreviewGallery.css';

interface PreviewGalleryProps {
  plan: PlanKalendaria;
  title: string;
  subtitle: string;
  showProportion?: boolean;
  showLayoutZones?: boolean;
  fontsReady?: boolean;
  pageFormat?: PageFormat;
  extraControls?: React.ReactNode;
  links?: { href: string; label: string }[];
}

function readIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || params.get('kal');
}

function writeIdToUrl(id: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (id) params.set('id', id);
  else params.delete('id');
  params.delete('kal');
  const qs = params.toString();
  history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
}

export function PreviewGallery({
  plan,
  title,
  subtitle,
  showProportion = false,
  showLayoutZones = false,
  fontsReady = true,
  pageFormat = 'A4',
  extraControls,
  links = [{ href: '/', label: '← Aplikacja' }],
}: PreviewGalleryProps) {
  const [year, setYear] = useState(2026);
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [lightboxId, setLightboxId] = useState<string | null>(readIdFromUrl);

  const categories = useMemo(
    () => [...new Set(plan.kalendaria.map((k) => k.kategoria))].sort(),
    [plan],
  );

  useEffect(() => {
    loadGoogleFonts(collectFontsFromPlan(plan.kalendaria));
  }, [plan]);

  useEffect(() => {
    writeIdToUrl(lightboxId);
  }, [lightboxId]);

  useEffect(() => {
    const id = readIdFromUrl();
    if (id && plan.kalendaria.some((k) => k.id === id)) {
      setLightboxId(id);
    }
  }, [plan.kalendaria]);

  const filtered = plan.kalendaria.filter((k) => {
    if (selected && k.id !== selected) return false;
    if (category && k.kategoria !== category) return false;
    return true;
  });

  const BATCH = 12;
  const [renderCount, setRenderCount] = useState(BATCH);

  useEffect(() => {
    setRenderCount(selected ? filtered.length : BATCH);
  }, [selected, category, filtered.length]);

  useEffect(() => {
    if (selected || renderCount >= filtered.length) return undefined;
    const timer = window.setTimeout(() => {
      setRenderCount((n) => Math.min(n + BATCH, filtered.length));
    }, 60);
    return () => clearTimeout(timer);
  }, [renderCount, filtered.length, selected]);

  const visible = filtered.slice(0, renderCount);
  const remaining = filtered.length - visible.length;
  const total = plan.kalendaria.length;

  const lightboxKal = lightboxId
    ? plan.kalendaria.find((k) => k.id === lightboxId) ?? null
    : null;

  const navList = lightboxKal && filtered.some((k) => k.id === lightboxKal.id)
    ? filtered
    : plan.kalendaria;
  const navIndex = lightboxKal ? navList.findIndex((k) => k.id === lightboxKal.id) : -1;

  const openLightbox = useCallback((id: string) => {
    setLightboxId(id);
    setSelected(null);
  }, []);

  const closeLightbox = useCallback(() => setLightboxId(null), []);

  const goPrev = useCallback(() => {
    if (navIndex > 0) setLightboxId(navList[navIndex - 1].id);
  }, [navIndex, navList]);

  const goNext = useCallback(() => {
    if (navIndex >= 0 && navIndex < navList.length - 1) {
      setLightboxId(navList[navIndex + 1].id);
    }
  }, [navIndex, navList]);

  return (
    <div className={`preview-gallery${fontsReady ? '' : ' preview-gallery--loading'}`}>
      <header className="preview-gallery__header">
        <div>
          <h1>
            {title} <span>Kalendarium+</span>
          </h1>
          <p>{subtitle}</p>
          <p className="preview-gallery__tip">Kliknij miniaturę, aby zobaczyć kalendarz w dużym rozmiarze</p>
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
            <select
              value={selected ?? ''}
              onChange={(e) => {
                const v = e.target.value || null;
                setSelected(v);
                if (v) openLightbox(v);
              }}
            >
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

      <div className="preview-gallery__grid">
        {visible.map((k) => (
          <article key={k.id} className="preview-gallery__card">
            <button
              type="button"
              className="preview-gallery__card-open"
              onClick={() => openLightbox(k.id)}
              aria-label={`Powiększ podgląd ${k.id} ${k.nazwa}`}
            >
              <MonthPagePreview
                kalendarium={k}
                year={year}
                showProportion={showProportion}
                showLayoutZones={showLayoutZones}
                pageFormat={pageFormat}
              />
              <span className="preview-gallery__zoom-hint" aria-hidden>🔍 Powiększ</span>
            </button>
            <CopyThemeJsonButton kalendarium={k} variant="card" />
          </article>
        ))}
      </div>

      {remaining > 0 && (
        <p className="preview-gallery__loading">
          Ładowanie kolejnych szablonów… ({visible.length}/{filtered.length})
        </p>
      )}

      {filtered.length === 0 && (
        <p className="preview-gallery__empty">Brak szablonów dla wybranych filtrów.</p>
      )}

      {lightboxKal && (
        <PreviewLightbox
          kalendarium={lightboxKal}
          year={year}
          index={navIndex}
          total={navList.length}
          showProportion={showProportion}
          showLayoutZones={showLayoutZones}
          pageFormat={pageFormat}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  );
}
