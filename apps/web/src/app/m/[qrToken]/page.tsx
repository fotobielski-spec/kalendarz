type Props = { params: Promise<{ qrToken: string }> };

/**
 * Capture na telefonie — bezpośredni link lub po opcjonalnym QR z desktopu (etap 1–2).
 */
export default async function MobileCapturePage({ params }: Props) {
  const { qrToken } = await params;
  return (
    <main style={{ padding: '1.5rem' }}>
      <h1>Zdjęcie biometryczne</h1>
      <p>Token sesji: {qrToken}</p>
      <ul>
        <li>Załaduj zdjęcie z galerii</li>
        <li>Otwórz aparat (selfie)</li>
      </ul>
      <p style={{ color: '#64748b' }}>Implementacja w ETAPIE 1.</p>
    </main>
  );
}
