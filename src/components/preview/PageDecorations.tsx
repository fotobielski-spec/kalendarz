import type { Dekoracja, Paleta } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle } from '../../utils/previewUtils';
import './PageDecorations.css';

interface PageDecorationsProps {
  dekoracje: Dekoracja[];
  accent: string;
  paleta: Paleta;
}

function pctX(mm: number, pageW: number) { return `${(mm / pageW) * 100}%`; }
function pctY(mm: number, pageH: number) { return `${(mm / pageH) * 100}%`; }

export function PageDecorations({ dekoracje, accent, paleta }: PageDecorationsProps) {
  const { pageW, pageH, layoutScale = 1 } = usePageSize();
  const px = (mm: number) => pctX(mm * layoutScale, pageW);
  const py = (mm: number) => pctY(mm * layoutScale, pageH);
  const mms = (obs: { x: number; y: number; szerokosc: number; wysokosc: number }) =>
    mmPosStyle(obs, pageW, pageH, layoutScale);
  return (
    <>
      {dekoracje.map((d, i) => {
        const key = `${d.typ}-${i}`;

        if (d.typ === 'linia' && d.x != null && d.y != null) {
          return (
            <div
              key={key}
              className="deco deco--line"
              style={{
                left: px(d.x),
                top: py(d.y),
                width: px(d.szerokosc ?? 186),
                height: `${d.grubosc ?? 1}px`,
                background: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'linia-pionowa' && d.x != null && d.y != null) {
          return (
            <div
              key={key}
              className="deco deco--line-v"
              style={{
                left: px(d.x),
                top: py(d.y),
                width: `${d.grubosc ?? 1}px`,
                height: py(d.wysokosc ?? 273),
                background: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'linia-zlota' && d.pozycja) {
          const p = d.pozycja as { x: number; y: number };
          return (
            <div
              key={key}
              className="deco deco--gold-line"
              style={{ left: px(p.x), top: py(p.y), width: px(d.szerokosc ?? 186) }}
            />
          );
        }

        if (d.typ === 'gradient-fade' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--gradient"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                height: py(d.wysokosc ?? 40),
                background: `linear-gradient(to bottom, ${d.od ?? 'transparent'}, ${d.do ?? paleta.tlo ?? '#fff'})`,
              }}
            />
          );
        }

        if (d.typ === 'frosted-panel' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--frosted"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                height: py(d.wysokosc ?? 109),
              }}
            />
          );
        }

        if (d.typ === 'fala' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--wave"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                color: d.kolor ?? paleta.tlo ?? '#E8F4F8',
              }}
            />
          );
        }

        if (d.typ === 'podarta-krawedz' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--torn"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                color: d.kolor ?? paleta.tlo ?? '#F4E8D1',
              }}
            />
          );
        }

        if (d.typ === 'zaluzja' && d.x != null) {
          const stripes = d.paski ?? 8;
          return (
            <div
              key={key}
              className="deco deco--blinds"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                height: py(d.wysokosc ?? 164),
                background: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent calc(100% / ${stripes * 2}),
                  rgba(0,0,0,0.12) calc(100% / ${stripes * 2}),
                  rgba(0,0,0,0.12) calc(100% / ${stripes})
                )`,
              }}
            />
          );
        }

        if (d.typ === 'neon-linia' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--neon-line"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                boxShadow: `0 0 8px ${d.kolor ?? '#FF00FF'}, 0 0 16px ${d.kolor ?? '#FF00FF'}`,
                background: d.kolor ?? '#FF00FF',
              }}
            />
          );
        }

        if (d.typ === 'neon-poswiata' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--neon-glow"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 186),
                height: py(d.wysokosc ?? 164),
                boxShadow: `inset 0 0 30px ${d.kolor ?? '#FF00FF'}44`,
              }}
            />
          );
        }

        if (d.typ === 'pierścienie' && d.cx != null) {
          return (
            <div key={key} className="deco deco--rings">
              {(d.promienie ?? []).map((r, ri) => (
                <div
                  key={ri}
                  className="deco__ring"
                  style={{
                    left: px((d.cx ?? 105) - r),
                    top: py((d.cy ?? 80) - r),
                    width: px(r * 2),
                    height: py(r * 2),
                    borderColor: d.kolor ?? accent,
                  }}
                />
              ))}
            </div>
          );
        }

        if (d.typ === 'wieniec-lisci' && d.cx != null) {
          return (
            <div
              key={key}
              className="deco deco--wreath"
              style={{
                left: px((d.cx ?? 105) - (d.promien ?? 78)),
                top: py((d.cy ?? 80) - (d.promien ?? 78)),
                width: px((d.promien ?? 78) * 2),
                height: py((d.promien ?? 78) * 2),
                borderColor: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'heksagon-obrys' && d.cx != null) {
          return (
            <div
              key={key}
              className="deco deco--hex-outline"
              style={{
                left: px((d.cx ?? 105) - (d.rozmiar ?? 68)),
                top: py((d.cy ?? 80) - (d.rozmiar ?? 68)),
                width: px((d.rozmiar ?? 68) * 2),
                height: py((d.rozmiar ?? 68) * 2),
                borderColor: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'deco-narozniki' && d.obszar) {
          return (
            <div key={key} className="deco deco--deco-corners" style={{ ...mms(d.obszar), borderColor: d.kolor ?? accent }} />
          );
        }

        if (d.typ === 'ornament-narozniki' && d.obszar) {
          return (
            <div key={key} className="deco deco--ornament-corners" style={{ ...mms(d.obszar), borderColor: d.kolor ?? accent }} />
          );
        }

        if (d.typ === 'tekstura-beton' && d.obszar) {
          return (
            <div key={key} className="deco deco--concrete" style={mms(d.obszar)} />
          );
        }

        if (d.typ === 'perforacja' && d.y != null) {
          return (
            <div
              key={key}
              className="deco deco--perforation"
              style={{ top: py(d.y), width: px(d.szerokosc ?? 186), left: px(12) }}
            />
          );
        }

        if (d.typ === 'spirala' && d.cx != null) {
          return (
            <div
              key={key}
              className="deco deco--spiral"
              style={{
                left: px((d.cx ?? 198) - (d.promien ?? 80)),
                top: py((d.cy ?? 164) - (d.promien ?? 80)),
                width: px((d.promien ?? 80) * 2),
                height: py((d.promien ?? 80) * 2),
                borderColor: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'kropka' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--dot"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: `${d.rozmiar ?? 4}px`,
                height: `${d.rozmiar ?? 4}px`,
                background: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'luk-ramka' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--arch-frame"
              style={{
                left: px(d.x),
                top: py(d.y ?? 0),
                width: px(d.szerokosc ?? 166),
                height: py(d.wysokosc ?? 164),
                borderColor: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'plama-akwarelowa') {
          const x = (d as { x?: number }).x ?? (d.pozycja as { x: number })?.x ?? 0;
          const y = (d as { y?: number }).y ?? (d.pozycja as { y: number })?.y ?? 0;
          const size = (d as { rozmiar?: number }).rozmiar ?? 50;
          return (
            <div
              key={key}
              className="deco deco--watercolor"
              style={{
                left: px(x),
                top: py(y),
                width: `${size}px`,
                height: `${size}px`,
                background: d.kolor,
              }}
            />
          );
        }

        if (d.typ === 'origami-fold' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--origami"
              style={{ left: px(d.x), top: py(d.y ?? 0), borderColor: d.kolor ?? '#FFF9F0' }}
            />
          );
        }

        if (d.typ === 'ramka-zewnetrzna') {
          return (
            <div
              key={key}
              className="deco deco--outer-frame"
              style={{ borderColor: d.kolor ?? accent, margin: `${d.margines ?? 8}px` }}
            />
          );
        }

        if (d.typ === 'nakladka' && d.obszar) {
          return (
            <div
              key={key}
              className="deco deco--overlay"
              style={{ ...mms(d.obszar), background: d.kolor ?? 'rgba(0,0,0,0.45)' }}
            />
          );
        }

        return null;
      })}
    </>
  );
}
