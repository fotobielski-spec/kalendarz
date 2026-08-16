import type { CSSProperties } from 'react';

type BiometricGuideMaskProps = {
  faceCenterX?: number;
  leftMargin?: number;
  rightMargin?: number;
  eyeLine?: number;
  chinLine?: number;
  foreheadLine?: number;
};

/**
 * Maska kadrowania oparta na regułach z FOTOWAY ID (profil PL 35x45).
 * W ETAPIE 1 jest to wizualny przewodnik selfie; walidacja odbywa się po wysyłce.
 */
export function BiometricGuideMask({
  faceCenterX = 0.5,
  leftMargin = 0.22,
  rightMargin = 0.78,
  eyeLine = 0.42,
  chinLine = 0.78,
  foreheadLine = 0.2,
}: BiometricGuideMaskProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      <div
        style={{
          position: 'absolute',
          inset: '10% 18%',
          border: '3px dashed #ffffff',
          borderRadius: '45% 45% 50% 50%',
          background: 'transparent',
        }}
      />

      <div style={lineStyle('vertical', faceCenterX, '#f8fafc', 'Środek twarzy')} />
      <div style={lineStyle('vertical', leftMargin, '#86efac')} />
      <div style={lineStyle('vertical', rightMargin, '#86efac')} />
      <div style={lineStyle('horizontal', eyeLine, '#93c5fd', 'Linia oczu')} />
      <div style={lineStyle('horizontal', foreheadLine, '#fcd34d', 'Linia czoła')} />
      <div style={lineStyle('horizontal', chinLine, '#fda4af', 'Linia brody')} />
    </div>
  );
}

function lineStyle(
  direction: 'horizontal' | 'vertical',
  pos: number,
  color: string,
  _label?: string
): CSSProperties {
  if (direction === 'vertical') {
    return {
      position: 'absolute',
      top: '6%',
      bottom: '6%',
      left: `${pos * 100}%`,
      width: 0,
      borderLeft: `2px dashed ${color}`,
      opacity: 0.9,
    };
  }
  return {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: `${pos * 100}%`,
    height: 0,
    borderTop: `2px dashed ${color}`,
    opacity: 0.9,
  };
}
