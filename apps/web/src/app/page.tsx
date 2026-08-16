import Link from 'next/link';

/**
 * Landing page — CTA i QR w pełnej implementacji ETAPU 1.
 */
export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Dokumenty ID Web</h1>
      <p style={{ maxWidth: 560, color: '#475569', marginBottom: '1.5rem' }}>
        Zrób zdjęcie biometryczne do dowodu lub paszportu. Możesz wejść od razu z telefonu
        (bez QR) albo rozpocząć na komputerze i zeskanować kod QR.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <Link
          href="/mobile"
          style={{
            display: 'inline-block',
            padding: '0.875rem 1.4rem',
            background: '#0f766e',
            color: '#fff',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: 'var(--shadow)',
          }}
        >
          Jestem na telefonie (bez QR)
        </Link>
        <Link
          href="/start"
          style={{
            display: 'inline-block',
            padding: '0.875rem 1.4rem',
            background: 'var(--color-primary)',
            color: '#fff',
            borderRadius: 'var(--radius)',
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: 'var(--shadow)',
          }}
        >
          Zacznij na komputerze (QR)
        </Link>
      </div>
      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#94a3b8' }}>
        ETAP 3: mobile-first + QR + analiza + generowanie plików
      </p>
    </main>
  );
}
