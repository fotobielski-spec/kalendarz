import planData from '../../data/plan-kalendaria-art-40-60.json';
import type { PlanKalendaria } from '../types/plan';
import { PreviewGallery } from './PreviewGallery';

const plan = planData as PlanKalendaria;

export function ArtPreviewPage() {
  return (
    <PreviewGallery
      plan={plan}
      title="Kolekcja Art —"
      subtitle="30 przepięknych kalendarzy A4 pion · proporcja 40% kalendarium · 60% zdjęcie · każdy unikalny"
      showProportion
      links={[
        { href: '/podglad.html', label: '← Klasyczne (20)' },
        { href: '/', label: 'Aplikacja' },
      ]}
    />
  );
}
