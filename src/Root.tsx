import { lazy, Suspense, useEffect, useState } from 'react';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ViewLoading } from './components/ViewLoading';

const ArtPreviewPage = lazy(() =>
  import('./pages/ArtPreviewPage').then((m) => ({ default: m.ArtPreviewPage })),
);
const KreatorPionPreviewPage = lazy(() =>
  import('./pages/KreatorPionPreviewPage').then((m) => ({ default: m.KreatorPionPreviewPage })),
);
const ClassicPreviewPage = lazy(() =>
  import('./pages/ClassicPreviewPage').then((m) => ({ default: m.ClassicPreviewPage })),
);

type View = 'app' | 'podglad' | 'art' | 'kreator-pion';

function resolveView(): View {
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'kreator-pion' || path === '/kreator-pion' || path.endsWith('/kreator-pion') || path.includes('kreator-pion')) {
    return 'kreator-pion';
  }
  if (view === 'art' || path === '/art' || path.endsWith('/art') || path.includes('podglad-art')) {
    return 'art';
  }
  if (view === 'podglad' || path === '/podglad' || path.endsWith('/podglad') || path.includes('podglad')) {
    return 'podglad';
  }
  return 'app';
}

const VIEW_LABELS: Record<View, string> = {
  app: 'aplikacji',
  podglad: 'kalendarzy klasycznych',
  art: 'galerii poziomych',
  'kreator-pion': 'KREATOR PION A4,A3',
};

export function Root() {
  const [view, setView] = useState<View>(resolveView);

  useEffect(() => {
    const sync = () => setView(resolveView());
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  if (view === 'app') {
    return <App />;
  }

  const Page =
    view === 'kreator-pion'
      ? KreatorPionPreviewPage
      : view === 'art'
        ? ArtPreviewPage
        : ClassicPreviewPage;

  return (
    <ErrorBoundary label={VIEW_LABELS[view]}>
      <Suspense fallback={<ViewLoading label={VIEW_LABELS[view]} />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  );
}
