/**
 * Panel admin v1 — ETAP 5: zamówienia, pliki, analizy, RBAC.
 */
export default function AdminHomePage() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Panel administracyjny</h1>
      <p>Moduły: zamówienia · analizy · pliki · audit log — etap 5.</p>
      <ul>
        <li>Wszystkie zamówienia</li>
        <li>Zrealizowane</li>
        <li>Porzucone koszyki</li>
        <li>KPI dashboard</li>
      </ul>
    </main>
  );
}
