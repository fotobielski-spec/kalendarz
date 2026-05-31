/**
 * Ekran QR + status sesji — implementacja w ETAPIE 1.
 */
export default function StartPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>Twoja sesja</h1>
      <p>Tutaj pojawi się kod QR i status sesji (etap 1).</p>
      <p style={{ color: '#64748b' }}>
        API: <code>POST /api/v1/sessions</code>
      </p>
    </main>
  );
}
