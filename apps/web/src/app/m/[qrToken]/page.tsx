'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiUrl } from '../../../lib/api';
import { BiometricGuideMask } from '../../../components/BiometricGuideMask';

type SessionPayload = {
  sessionId: string;
  qrToken: string;
  status: string;
  expiresAt: string;
};

type AnalysisPayload = {
  sessionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  compliancePercent: number;
  violations: Array<{
    code: string;
    severity: 'error' | 'warning';
    score?: number;
  }>;
  rules?: {
    hair_on_face?: { passed: boolean; score?: number };
    hair_on_eyebrows?: { passed: boolean; score?: number };
  };
};

type GeneratedAssetsPayload = {
  sessionId: string;
  status: 'preview_ready';
  previewUrl: string;
  previewTokenExpiresAt: string;
  assets: Array<{
    assetId: string;
    type: 'electronic' | 'imposition_1x8';
    status: 'ready';
    expiresAt: string;
    securedDownloadUrl: string;
  }>;
};

const VIOLATION_MESSAGES_PL: Record<string, string> = {
  NO_FACE: 'Nie wykryto twarzy.',
  MULTIPLE_FACES: 'Wykryto więcej niż jedną twarz.',
  EYES_NOT_DETECTED: 'Nie wykryto oczu.',
  FACE_TOO_SMALL: 'Twarz jest zbyt mała.',
  FACE_TOO_LARGE: 'Twarz jest zbyt duża.',
  FACE_CUT_OFF: 'Twarz lub głowa jest ucięta.',
  HEAD_TILTED: 'Głowa jest przechylona.',
  HEAD_TURNED: 'Twarz nie jest skierowana na wprost.',
  EYES_CLOSED: 'Oczy są zamknięte.',
  MOUTH_OPEN: 'Usta są otwarte.',
  SMILE_DETECTED: 'Mimika jest zbyt wyraźna.',
  BLURRY_IMAGE: 'Zdjęcie jest nieostre.',
  TOO_DARK: 'Zdjęcie jest za ciemne.',
  TOO_BRIGHT: 'Zdjęcie jest za jasne.',
  BAD_WHITE_BALANCE: 'Nieprawidłowy balans bieli.',
  BACKGROUND_NOT_UNIFORM: 'Tło nie jest jednolite.',
  BACKGROUND_SHADOW: 'Widać cień na tle.',
  FACE_SHADOW: 'Widać cień na twarzy.',
  GLASSES_REFLECTION: 'Występuje odblask na okularach.',
  HAIR_OVER_EYES: 'Włosy zasłaniają oczy lub brwi.',
  HAIR_ON_FACE: 'Włosy nachodzą na twarz.',
  HAIR_ON_EYEBROWS: 'Włosy zasłaniają brwi.',
  ANALYSIS_FAILED: 'Analiza nie powiodła się.',
  ENGINE_UNAVAILABLE:
    'Silnik analizy jest niedostępny. Sprawdź, czy FOTOWAY działa na http://127.0.0.1:8010, a potem spróbuj ponownie.',
  NO_UPLOADED_PHOTO: 'Najpierw prześlij zdjęcie, a potem uruchom analizę.',
};

const VIOLATION_FIX_TIPS_PL: Record<string, string> = {
  NO_FACE: 'Ustaw twarz centralnie w masce i zadbaj o dobre oświetlenie.',
  MULTIPLE_FACES: 'W kadrze może być tylko jedna osoba.',
  EYES_NOT_DETECTED: 'Patrz prosto w aparat i nie zasłaniaj oczu włosami.',
  FACE_TOO_SMALL: 'Podejdź trochę bliżej aparatu.',
  FACE_TOO_LARGE: 'Oddal telefon nieco od twarzy.',
  FACE_CUT_OFF: 'Cała głowa i broda muszą być w kadrze.',
  HEAD_TILTED: 'Wyprostuj głowę i trzymaj telefon pionowo.',
  HEAD_TURNED: 'Ustaw twarz dokładnie na wprost.',
  EYES_CLOSED: 'Otwórz oczy i zrób zdjęcie ponownie.',
  MOUTH_OPEN: 'Zamknij usta i rozluźnij mimikę.',
  SMILE_DETECTED: 'Zachowaj neutralny wyraz twarzy (bez uśmiechu).',
  BLURRY_IMAGE: 'Ustabilizuj telefon i poczekaj na ostrość przed zdjęciem.',
  TOO_DARK: 'Doświetl twarz z przodu (np. przy oknie).',
  TOO_BRIGHT: 'Unikaj prześwietlenia i mocnego światła bezpośrednio na twarz.',
  BAD_WHITE_BALANCE: 'Użyj neutralnego oświetlenia bez kolorowych lamp.',
  FACE_SHADOW: 'Usuń cień z twarzy, ustaw światło równomiernie z przodu.',
  GLASSES_REFLECTION: 'Zmień kąt telefonu lub zdejmij okulary do zdjęcia.',
  HAIR_OVER_EYES: 'Odsuń włosy tak, aby oczy i brwi były wyraźnie widoczne.',
  HAIR_ON_FACE: 'Odsuń włosy z policzków i czoła.',
  HAIR_ON_EYEBROWS: 'Odsłoń brwi - włosy nie mogą ich zakrywać.',
};

type ImageCaptureCtor = new (track: MediaStreamTrack) => {
  takePhoto: (settings?: Record<string, unknown>) => Promise<Blob>;
};

export default function MobileCapturePage() {
  const params = useParams<{ qrToken?: string }>();
  const router = useRouter();
  const qrToken = params?.qrToken ?? '';
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [uploadInfo, setUploadInfo] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisPayload | null>(null);
  const [lastPhotoPreviewUrl, setLastPhotoPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssetsPayload | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const feedbackAnchorRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const resolveSession = useCallback(async () => {
    if (!qrToken) {
      setError('Brak tokenu sesji. Wróć i rozpocznij ponownie.');
      setIsResolving(false);
      return;
    }

    setError(null);
    setIsResolving(true);
    try {
      const response = await fetch(apiUrl(`/sessions/by-token/${qrToken}`));
      if (response.status === 404 || response.status === 410) {
        // Self-healing for stale QR/mobile links after session expiration or API restart.
        const recreated = await fetch(apiUrl('/sessions'), { method: 'POST' });
        if (recreated.ok) {
          const payload = (await recreated.json()) as { qrToken: string };
          if (payload.qrToken) {
            router.replace(`/m/${payload.qrToken}`);
            return;
          }
        }
        throw new Error('SESSION_NOT_FOUND');
      }
      if (!response.ok) {
        throw new Error('SESSION_RESOLVE_FAILED');
      }
      const payload = (await response.json()) as SessionPayload;
      setSession(payload);
    } catch (err) {
      const code = err instanceof Error ? err.message : 'SESSION_RESOLVE_FAILED';
      if (code === 'SESSION_NOT_FOUND') {
        setError(
          'Nie znaleziono sesji. Otwórz ponownie stronę startową albo wejdź bezpośrednio przez /mobile.'
        );
      } else {
        setError('Błąd ładowania sesji.');
      }
    } finally {
      setIsResolving(false);
    }
  }, [qrToken, router]);

  useEffect(() => {
    void resolveSession();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [resolveSession]);

  useEffect(() => {
    if (!cameraOpen) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    const checkReady = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0 && video.readyState >= 2) {
        setCameraReady(true);
        return true;
      }
      return false;
    };

    const fallbackTimer = window.setTimeout(() => {
      // Na części urządzeń eventy video nie odpalają się poprawnie mimo aktywnego strumienia.
      // Po krótkim czasie dopuszczamy wykonanie zdjęcia i próbujemy pobrać klatkę.
      setCameraReady(true);
    }, 1800);

    const interval = window.setInterval(() => {
      if (checkReady()) {
        window.clearInterval(interval);
      }
    }, 150);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(fallbackTimer);
    };
  }, [cameraOpen]);

  useEffect(() => {
    if (!analysis && !error) {
      return;
    }
    feedbackAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [analysis, error]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const updatePhotoPreview = useCallback((blob: Blob) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(blob);
    previewObjectUrlRef.current = objectUrl;
    setLastPhotoPreviewUrl(objectUrl);
  }, []);

  useEffect(() => {
    if (!cameraOpen) {
      return;
    }

    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) {
      return;
    }

    // Po przełączeniu cameraOpen komponent video dopiero się montuje.
    // Ten efekt podpina istniejący stream do gotowego elementu <video>.
    video.srcObject = stream;
    void video.play().catch(() => undefined);
  }, [cameraOpen]);

  const uploadBlob = useCallback(
    async (blob: Blob, filename: string) => {
      if (!session) {
        return;
      }
      setIsUploading(true);
      setError(null);
      setProgressMessage('Wysyłanie zdjęcia...');
      setUploadInfo(null);
      setGeneratedAssets(null);
      setAnalysis(null);
      updatePhotoPreview(blob);
      try {
        const form = new FormData();
        form.append('file', blob, filename);
        const response = await fetch(apiUrl(`/sessions/${session.sessionId}/uploads`), {
          method: 'POST',
          body: form,
        });
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error ?? 'Upload nie powiódł się.');
        }
        const body = (await response.json()) as { status: string; sizeBytes: number };
        setUploadInfo(`Zdjęcie zapisane poprawnie (${body.sizeBytes} B), status: ${body.status}.`);
        setProgressMessage('Analizowanie zdjęcia...');
        await runAnalysis(session.sessionId);
      } catch (err) {
        setProgressMessage(null);
        setError(err instanceof Error ? err.message : 'Nie udało się wysłać zdjęcia.');
      } finally {
        setIsUploading(false);
      }
    },
    [session, updatePhotoPreview]
  );

  const runAnalysis = useCallback(async (sessionId: string) => {
    setIsAnalyzing(true);
    setError(null);
    setProgressMessage((current) => current ?? 'Analizowanie zdjęcia...');
    try {
      const response = await fetch(apiUrl(`/sessions/${sessionId}/analyze`), {
        method: 'POST',
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(body.message ?? body.error ?? 'ANALYSIS_FAILED');
      }
      const payload = (await response.json()) as AnalysisPayload;
      setAnalysis(payload);
      setProgressMessage(null);
      if (payload.compliancePercent < 100) {
        setGeneratedAssets(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ANALYSIS_FAILED';
      const normalizedCode =
        message.includes('FOTOWAY API') ||
        message.includes('FOTOWAY_LEGACY_UNREACHABLE') ||
        message.toLowerCase().includes('fetch failed') ||
        message.toLowerCase().includes('econnrefused') ||
        message.toLowerCase().includes('timed out')
          ? 'ENGINE_UNAVAILABLE'
          : message;
      setError(VIOLATION_MESSAGES_PL[normalizedCode] ?? message ?? 'Nie udało się przeanalizować zdjęcia.');
      setProgressMessage(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateAssets = useCallback(async (sessionId: string) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(apiUrl(`/sessions/${sessionId}/generate-assets`), {
        method: 'POST',
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? 'GENERATION_FAILED');
      }
      const payload = (await response.json()) as GeneratedAssetsPayload;
      setGeneratedAssets(payload);
    } catch (err) {
      const code = err instanceof Error ? err.message : 'GENERATION_FAILED';
      if (code === 'ANALYSIS_IN_PROGRESS') {
        setError('Najpierw wymagany wynik 100% zgodności analizy.');
      } else {
        setError('Nie udało się wygenerować plików. Spróbuj ponownie.');
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const onFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      await uploadBlob(file, file.name);
      event.target.value = '';
    },
    [uploadBlob]
  );

  const openCamera = useCallback(async () => {
    setError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 2160 },
          height: { ideal: 2880 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      setError('Brak dostępu do kamery. Sprawdź uprawnienia przeglądarki.');
    }
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraReady(false);
  }, []);

  const capturePhoto = useCallback(async () => {
    setError(null);
    setProgressMessage('Robię zdjęcie...');
    const stream = streamRef.current;
    if (!stream) {
      setProgressMessage(null);
      setError('Brak aktywnego strumienia kamery.');
      return;
    }

    const track = stream.getVideoTracks()[0];
    if (!track) {
      setProgressMessage(null);
      setError('Nie wykryto aktywnej kamery.');
      return;
    }

    // Na wspieranych urządzeniach przechwytujemy pełny kadr z toru kamery
    // (lepsza jakość wejściowa dla usuwania tła niż klatka z <video> + canvas).
    const imageCaptureCtor = (window as Window & { ImageCapture?: ImageCaptureCtor }).ImageCapture;
    if (imageCaptureCtor) {
      try {
        const imageCapture = new imageCaptureCtor(track);
        const directBlob = await imageCapture.takePhoto();
        if (directBlob && directBlob.size > 0) {
          closeCamera();
          await uploadBlob(directBlob, `capture-${Date.now()}.jpg`);
          return;
        }
      } catch {
        // Fallback do canvas poniżej.
      }
    }

    const video = videoRef.current;
    if (!video) {
      setProgressMessage(null);
      return;
    }
    if (!cameraReady || video.videoWidth === 0 || video.videoHeight === 0) {
      setProgressMessage(null);
      setError('Kamera nie jest jeszcze gotowa. Poczekaj chwilę i spróbuj ponownie.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setProgressMessage(null);
      setError('Nie udało się przechwycić klatki aparatu.');
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.95)
    );
    if (!blob) {
      setProgressMessage(null);
      setError('Nie udało się zapisać zdjęcia. Spróbuj wykonać zdjęcie ponownie.');
      return;
    }
    closeCamera();
    await uploadBlob(blob, `capture-${Date.now()}.jpg`);
  }, [cameraReady, closeCamera, uploadBlob]);

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '1.25rem' }}>
      <h1 style={{ marginBottom: 8 }}>Zdjęcie do dokumentu</h1>
      <p style={{ color: '#475569', marginBottom: 16 }}>
        Wybierz zdjęcie z galerii albo uruchom aparat przedni (selfie) i dopasuj twarz do maski.
      </p>

      {isResolving && <p>Ładowanie sesji...</p>}
      {session && (
        <div style={{ marginBottom: 12, fontSize: '0.9rem', color: '#334155' }}>
          Sesja: <code>{session.sessionId}</code>
        </div>
      )}

      <div ref={feedbackAnchorRef} />
      {error && (
        <div style={{ marginBottom: 12, color: '#b91c1c', fontWeight: 600 }}>
          {error}
        </div>
      )}
      {progressMessage && (
        <div style={{ marginBottom: 12, color: '#1d4ed8', fontWeight: 600 }}>{progressMessage}</div>
      )}
      {uploadInfo && (
        <div style={{ marginBottom: 12, color: '#166534', fontWeight: 600 }}>
          {uploadInfo}
        </div>
      )}
      {isAnalyzing && (
        <div style={{ marginBottom: 12, color: '#1d4ed8', fontWeight: 600 }}>Trwa analiza zdjęcia...</div>
      )}
      {analysis && (
        <section
          style={{
            marginBottom: 14,
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '0.875rem',
            background: '#f8fafc',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(140px, 180px) 1fr',
              gap: 12,
              alignItems: 'start',
            }}
          >
            <div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 6 }}>
                Ostatnie zdjęcie
              </div>
              {lastPhotoPreviewUrl ? (
                <img
                  src={lastPhotoPreviewUrl}
                  alt="Zdjęcie przekazane do analizy"
                  style={{
                    width: '100%',
                    maxWidth: 180,
                    borderRadius: 8,
                    border: '1px solid #94a3b8',
                  }}
                />
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Podgląd zdjęcia pojawi się po przesłaniu.
                </div>
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Wynik analizy: {analysis.compliancePercent}%
              </div>
              {analysis.compliancePercent === 100 ? (
                <div style={{ color: '#166534' }}>
                  Zdjęcie zaakceptowane. Drobne uwagi (jeśli są) nie blokują — program skoryguje kadr
                  i tło. Możesz przejść do „gotowe do druku”.
                </div>
              ) : (
                <div style={{ color: '#b45309' }}>
                  Zdjęcie nie przeszło. Poniżej masz dokładnie co poprawić.
                </div>
              )}
              {analysis.rules && (
                <ul style={{ margin: '10px 0 0', paddingLeft: 18, color: '#475569' }}>
                  <li>
                    Włosy na twarzy:{' '}
                    {analysis.rules.hair_on_face?.passed === false ? 'niepoprawnie' : 'OK'}
                  </li>
                  <li>
                    Brwi odkryte:{' '}
                    {analysis.rules.hair_on_eyebrows?.passed === false ? 'niepoprawnie' : 'OK'}
                  </li>
                </ul>
              )}
              {analysis.violations.length > 0 ? (
                <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
                  {analysis.violations.map((item) => (
                    <li
                      key={`${item.code}-${item.severity}`}
                      style={{
                        color: item.severity === 'error' ? '#b91c1c' : '#b45309',
                        marginBottom: 6,
                      }}
                    >
                      <div>{VIOLATION_MESSAGES_PL[item.code] ?? item.code}</div>
                      <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                        Co poprawić: {VIOLATION_FIX_TIPS_PL[item.code] ?? 'Popraw ustawienie twarzy i oświetlenie.'}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : analysis.compliancePercent < 100 ? (
                <div style={{ marginTop: 10, color: '#475569', fontSize: '0.9rem' }}>
                  Wykryto problem jakości zdjęcia bez szczegółowego kodu. Spróbuj poprawić ostrość,
                  oświetlenie i ustawienie twarzy centralnie w masce.
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => session && void runAnalysis(session.sessionId)}
            disabled={!session || isAnalyzing}
            style={{
              marginTop: 10,
              borderRadius: 8,
              border: '1px solid #334155',
              background: '#fff',
              color: '#0f172a',
              padding: '0.55rem 0.9rem',
              cursor: 'pointer',
            }}
          >
            Uruchom analizę ponownie
          </button>
          {analysis.compliancePercent === 100 && (
            <button
              type="button"
              onClick={() => session && void generateAssets(session.sessionId)}
              disabled={!session || isGenerating}
              style={{
                marginTop: 10,
                marginLeft: 10,
                borderRadius: 8,
                border: 'none',
                background: '#0f766e',
                color: '#fff',
                padding: '0.55rem 0.9rem',
                cursor: 'pointer',
              }}
            >
              {isGenerating ? 'Generowanie...' : 'Generuj 2 pliki'}
            </button>
          )}
          {analysis.compliancePercent === 100 && (
            <div style={{ marginTop: 8, fontSize: '0.86rem', color: '#475569' }}>
              W tle: auto-biometria, korekcja koloru, usunięcie tła i impozycja 1x8 z liniami cięcia.
            </div>
          )}
        </section>
      )}

      {generatedAssets && (
        <section
          style={{
            marginBottom: 14,
            border: '1px solid #cbd5e1',
            borderRadius: 10,
            padding: '0.875rem',
            background: '#f8fafc',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Pliki gotowe</div>
          <div style={{ marginBottom: 8, color: '#334155' }}>
            Podgląd zabezpieczonej miniatury (token ważny do:{' '}
            {new Date(generatedAssets.previewTokenExpiresAt).toLocaleTimeString('pl-PL')}).
          </div>
          <img
            src={generatedAssets.previewUrl}
            alt="Zabezpieczony podgląd miniatury"
            style={{ width: '100%', maxWidth: 360, borderRadius: 8, border: '1px solid #94a3b8' }}
          />
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {generatedAssets.assets.map((asset) => (
              <li key={asset.assetId}>
                {asset.type === 'electronic' ? 'Wersja elektroniczna' : 'Impozycja 1x8 10x15'}:{' '}
                <a href={asset.securedDownloadUrl} target="_blank" rel="noreferrer">
                  pobierz
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section style={{ display: 'grid', gap: 12 }}>
        <label
          style={{
            display: 'inline-block',
            borderRadius: 10,
            background: '#0f172a',
            color: '#fff',
            padding: '0.75rem 1rem',
            width: 'fit-content',
            cursor: 'pointer',
          }}
        >
          Załaduj zdjęcie
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(event) => void onFileChange(event)}
            disabled={!session || isUploading || isAnalyzing}
          />
        </label>

        {!cameraOpen ? (
          <button
            type="button"
            onClick={() => void openCamera()}
            disabled={!session || isUploading || isAnalyzing}
            style={{
              borderRadius: 10,
              border: '1px solid #334155',
              background: '#fff',
              color: '#0f172a',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
            }}
          >
            Otwórz aparat (selfie)
          </button>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                width: '100%',
                maxWidth: 380,
                margin: '0 auto',
                aspectRatio: '3 / 4',
                background: '#020617',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={() => setCameraReady(true)}
                onCanPlay={() => setCameraReady(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                  background: '#020617',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
              <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                <BiometricGuideMask />
              </div>
            </div>
            {!cameraReady && (
              <div style={{ color: '#475569', fontSize: '0.875rem' }}>
                Inicjalizacja kamery... poczekaj 1-2 sekundy.
              </div>
            )}
            <button
              type="button"
              onClick={() => void capturePhoto()}
              disabled={isUploading || isAnalyzing || !cameraReady}
              style={{
                borderRadius: 10,
                border: 'none',
                background: '#16a34a',
                color: '#fff',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
              }}
            >
              Zrób zdjęcie i wyślij
            </button>
            <button
              type="button"
              onClick={closeCamera}
              style={{
                borderRadius: 10,
                border: '1px solid #334155',
                background: '#fff',
                color: '#0f172a',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
              }}
            >
              Zamknij aparat
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
