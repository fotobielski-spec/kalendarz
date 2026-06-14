import App from './App';
import { ArtPreviewPage } from './pages/ArtPreviewPage';
import { ClassicPreviewPage } from './pages/ClassicPreviewPage';

type View = 'app' | 'podglad' | 'art';

function resolveView(): View {
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'art' || path.includes('podglad-art')) return 'art';
  if (view === 'podglad' || path.includes('podglad')) return 'podglad';
  return 'app';
}

export function Root() {
  const view = resolveView();

  if (view === 'art') return <ArtPreviewPage />;
  if (view === 'podglad') return <ClassicPreviewPage />;
  return <App />;
}
