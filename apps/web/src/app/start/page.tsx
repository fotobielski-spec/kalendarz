/**
 * Start zamówienia online — capture lub opcjonalny QR (desktop → telefon). Etap 1.
 */
export default function StartPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>Zrób zdjęcie</h1>
      <p>Na telefonie: od razu aparat lub galeria. Na komputerze: upload albo kod QR do otwarcia na telefonie.</p>
      <p style={{ color: '#64748b' }}>
        API: <code>POST /api/v1/sessions</code>
      </p>
    </main>
  );
}
