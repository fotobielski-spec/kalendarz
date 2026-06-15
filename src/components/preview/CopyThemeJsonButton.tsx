import { useCallback, useEffect, useRef, useState } from 'react';
import type { Kalendarium } from '../../types/plan';
import { copyThemeJson } from '../../utils/copyThemeJson';
import './CopyThemeJsonButton.css';

interface CopyThemeJsonButtonProps {
  kalendarium: Kalendarium;
  className?: string;
  variant?: 'card' | 'toolbar';
}

export function CopyThemeJsonButton({
  kalendarium,
  className = '',
  variant = 'card',
}: CopyThemeJsonButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      await copyThemeJson(kalendarium);
      setStatus('copied');
      timerRef.current = setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      timerRef.current = setTimeout(() => setStatus('idle'), 2500);
    }
  }, [kalendarium]);

  const label =
    status === 'copied' ? 'Skopiowano!' :
    status === 'error' ? 'Nie udało się skopiować' :
    'Kopiuj JSON motywu';

  return (
    <button
      type="button"
      className={[
        'copy-theme-json',
        `copy-theme-json--${variant}`,
        status === 'copied' && 'copy-theme-json--copied',
        status === 'error' && 'copy-theme-json--error',
        className,
      ].filter(Boolean).join(' ')}
      onClick={handleCopy}
      title={`Kopiuj JSON motywu ${kalendarium.id}`}
      aria-label={`Kopiuj JSON motywu ${kalendarium.id}`}
    >
      {status === 'idle' && <span className="copy-theme-json__icon" aria-hidden>{'{ }'}</span>}
      {label}
    </button>
  );
}
