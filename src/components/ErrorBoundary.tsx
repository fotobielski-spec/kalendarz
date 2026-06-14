import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 640, margin: '0 auto' }}>
          <h1>Błąd ładowania {this.props.label ?? 'strony'}</h1>
          <p style={{ color: '#64748b' }}>
            Sprawdź, czy serwer działa (<code>npm run dev</code>) i odśwież stronę.
          </p>
          <pre style={{ background: '#fef2f2', padding: '1rem', borderRadius: 8, overflow: 'auto', fontSize: '0.8rem' }}>
            {this.state.error.message}
          </pre>
          <p>
            <a href="/">← Wróć do aplikacji</a>
            {' · '}
            <a href="/podglad-art.html">Podgląd Art (bezpośredni)</a>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
