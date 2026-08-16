'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '../../lib/api';

type CreateSessionPayload = {
  qrToken: string;
};

/**
 * Mobile-first wejście bez kodu QR.
 * Tworzymy sesję po stronie API i przekierowujemy użytkownika na /m/[qrToken].
 */
export default function MobileEntryPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const createAndRedirect = async () => {
      try {
        const response = await fetch(apiUrl('/sessions'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (!response.ok) {
          throw new Error('Nie udało się utworzyć sesji mobilnej.');
        }
        const payload = (await response.json()) as CreateSessionPayload;
        if (!isCancelled) {
          router.replace(`/m/${payload.qrToken}?entry=mobile`);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Błąd uruchamiania ścieżki mobilnej.');
        }
      }
    };

    void createAndRedirect();
    return () => {
      isCancelled = true;
    };
  }, [router]);

  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '1.25rem' }}>
      <section style={{ maxWidth: 520, textAlign: 'center' }}>
        <h1 style={{ marginBottom: 8 }}>Uruchamianie trybu telefonu</h1>
        {!error ? (
          <p style={{ color: '#475569' }}>Tworzę sesję i przekierowuję do aparatu lub uploadu zdjęcia...</p>
        ) : (
          <>
            <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>
            <Link href="/" style={{ color: '#0f172a' }}>
              Wróć na stronę główną
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
