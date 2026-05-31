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
      <p style={{ maxWidth: 520, color: '#475569', marginBottom: '2rem' }}>
        Zrób zdjęcie biometryczne do dowodu lub paszportu. Zeskanuj kod QR telefonem, załaduj
        zdjęcie lub użyj aparatu — resztą zajmiemy się my.
      </p>
      <Link
        href="/start"
        style={{
          display: 'inline-block',
          padding: '0.875rem 2rem',
          background: 'var(--color-primary)',
          color: '#fff',
          borderRadius: 'var(--radius)',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: 'var(--shadow)',
        }}
      >
        Rozpocznij — wygeneruj kod QR
      </Link>
      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#94a3b8' }}>
        ETAP 0: szkielet UI · pełny flow w etapie 1
      </p>
    </main>
  );
}
