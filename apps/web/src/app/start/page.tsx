'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../../lib/api';

type SessionState = {
  sessionId: string;
  qrToken: string;
  mobileUrl: string;
  expiresAt: string;
};

type SessionStatus = {
  sessionId: string;
  status: string;
  uploadCount: number;
  expiresAt: string;
};

export default function StartPage() {
  const [session, setSession] = useState<SessionState | null>(null);
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const createSession = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl('/sessions'), { method: 'POST' });
      if (!response.ok) {
        throw new Error('Nie udało się utworzyć sesji.');
      }
      const payload = (await response.json()) as SessionState;
      setSession(payload);
      setStatus({
        sessionId: payload.sessionId,
        status: 'created',
        uploadCount: 0,
        expiresAt: payload.expiresAt,
      });
    } catch {
      setError('Błąd połączenia z API. Sprawdź, czy backend jest uruchomiony.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    if (!session?.sessionId) {
      return;
    }
    const response = await fetch(apiUrl(`/sessions/${session.sessionId}`));
    if (!response.ok) {
      return;
    }
    const payload = (await response.json()) as SessionStatus;
    setStatus(payload);
  }, [session?.sessionId]);

  useEffect(() => {
    void createSession();
  }, [createSession]);

  useEffect(() => {
    if (!session) {
      return;
    }
    const timer = window.setInterval(() => {
      void refreshStatus();
    }, 2500);
    return () => window.clearInterval(timer);
  }, [session, refreshStatus]);

  const mobileEntryUrl = useMemo(() => {
    if (!session) {
      return '';
    }

    if (typeof window === 'undefined') {
      return session.mobileUrl;
    }

    return `${window.location.origin}/m/${session.qrToken}`;
  }, [session]);

  const qrUrl = useMemo(() => {
    if (!mobileEntryUrl) {
      return '';
    }

    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
      mobileEntryUrl
    )}`;
  }, [mobileEntryUrl]);

  return (
    <main style={{ padding: '2rem', maxWidth: 820, margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Zeskanuj kod QR telefonem</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        Na telefonie otworzy się strona z opcją załadowania zdjęcia albo uruchomienia aparatu
        selfie.
      </p>
      <p style={{ color: '#475569', marginBottom: '1.25rem' }}>
        Jeśli klient już jest na telefonie, nie potrzebuje QR — użyj ścieżki{' '}
        <Link href="/mobile" style={{ color: '#0f766e', fontWeight: 600 }}>
          mobile bez QR
        </Link>
        .
      </p>

      {isLoading && <p>Tworzę sesję...</p>}
      {error && (
        <div style={{ marginBottom: '1rem', color: '#b91c1c', fontWeight: 600 }}>{error}</div>
      )}

      {session && (
        <section style={{ display: 'grid', gap: '1.25rem' }}>
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '1rem',
              display: 'inline-block',
              background: '#fff',
            }}
          >
            {/* Zewnętrzny generator QR wystarcza do MVP etapu 1. */}
            <img src={qrUrl} alt="Kod QR do otwarcia sesji na telefonie" width={280} height={280} />
          </div>

          <div>
            <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: 6 }}>Link mobilny</div>
            <code style={{ wordBreak: 'break-all' }}>{mobileEntryUrl}</code>
          </div>

          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '1rem',
              background: '#f8fafc',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Status sesji</div>
            <div>Status: {status?.status ?? 'created'}</div>
            <div>Liczba uploadów: {status?.uploadCount ?? 0}</div>
            <div>Wygasa: {new Date(session.expiresAt).toLocaleString('pl-PL')}</div>
          </div>
        </section>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => void createSession()}
          style={{
            border: 'none',
            background: '#0f172a',
            color: '#fff',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            cursor: 'pointer',
          }}
        >
          Wygeneruj nową sesję
        </button>
        <Link href="/" style={{ color: '#0f172a', alignSelf: 'center' }}>
          Wróć na stronę główną
        </Link>
      </div>
    </main>
  );
}
