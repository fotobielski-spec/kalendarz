import './ViewLoading.css';

interface ViewLoadingProps {
  label?: string;
}

export function ViewLoading({ label = 'podglądu' }: ViewLoadingProps) {
  return (
    <div className="view-loading" role="status" aria-live="polite">
      <div className="view-loading__spinner" aria-hidden />
      <p>Ładowanie {label}…</p>
      <p className="view-loading__hint">Jeśli strona nie startuje, uruchom: <code>npm run dev</code></p>
    </div>
  );
}
