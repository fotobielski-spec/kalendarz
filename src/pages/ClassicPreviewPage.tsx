import planData from '../../data/plan-kalendaria-13s.json';
import type { PlanKalendaria } from '../types/plan';
import { PreviewGallery } from './PreviewGallery';

const plan = planData as PlanKalendaria;

export function ClassicPreviewPage() {
  return (
    <PreviewGallery
      plan={plan}
      title="Podgląd stycznia —"
      subtitle="20 szablonów kalendarzy A4 pion · 1 miesiąc na stronę · ze zdjęciami klienta"
      links={[
        { href: '/kreator-pion', label: 'KREATOR PION A4,A3 →' },
        { href: '/art', label: 'Poziome A4 →' },
        { href: '/', label: '← Aplikacja' },
      ]}
    />
  );
}
