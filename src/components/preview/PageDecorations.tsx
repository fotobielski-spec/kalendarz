import type { Dekoracja, Paleta } from '../../types/plan';
import { mmPosStyle } from '../../utils/previewUtils';
import './PageDecorations.css';

interface PageDecorationsProps {
  dekoracje: Dekoracja[];
  accent: string;
  paleta: Paleta;
}

function pctX(mm: number) { return `${(mm / 210) * 100}%`; }
function pctY(mm: number) { return `${(mm / 297) * 100}%`; }

export function PageDecorations({ dekoracje, accent, paleta }: PageDecorationsProps) {
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
                left: pctX(d.x),
                top: pctY(d.y),
                width: pctX(d.szerokosc ?? 186),
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
                left: pctX(d.x),
                top: pctY(d.y),
                width: `${d.grubosc ?? 1}px`,
                height: pctY(d.wysokosc ?? 273),
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
              style={{ left: pctX(p.x), top: pctY(p.y), width: pctX(d.szerokosc ?? 186) }}
            />
          );
        }

        if (d.typ === 'gradient-fade' && d.x != null) {
          return (
            <div
              key={key}
              className="deco deco--gradient"
              style={{
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
                height: pctY(d.wysokosc ?? 40),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
                height: pctY(d.wysokosc ?? 109),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
                height: pctY(d.wysokosc ?? 164),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 186),
                height: pctY(d.wysokosc ?? 164),
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
                    left: pctX((d.cx ?? 105) - r),
                    top: pctY((d.cy ?? 80) - r),
                    width: pctX(r * 2),
                    height: pctY(r * 2),
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
                left: pctX((d.cx ?? 105) - (d.promien ?? 78)),
                top: pctY((d.cy ?? 80) - (d.promien ?? 78)),
                width: pctX((d.promien ?? 78) * 2),
                height: pctY((d.promien ?? 78) * 2),
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
                left: pctX((d.cx ?? 105) - (d.rozmiar ?? 68)),
                top: pctY((d.cy ?? 80) - (d.rozmiar ?? 68)),
                width: pctX((d.rozmiar ?? 68) * 2),
                height: pctY((d.rozmiar ?? 68) * 2),
                borderColor: d.kolor ?? accent,
              }}
            />
          );
        }

        if (d.typ === 'deco-narozniki' && d.obszar) {
          return (
            <div key={key} className="deco deco--deco-corners" style={{ ...mmPosStyle(d.obszar), borderColor: d.kolor ?? accent }} />
          );
        }

        if (d.typ === 'ornament-narozniki' && d.obszar) {
          return (
            <div key={key} className="deco deco--ornament-corners" style={{ ...mmPosStyle(d.obszar), borderColor: d.kolor ?? accent }} />
          );
        }

        if (d.typ === 'tekstura-beton' && d.obszar) {
          return (
            <div key={key} className="deco deco--concrete" style={mmPosStyle(d.obszar)} />
          );
        }

        if (d.typ === 'perforacja' && d.y != null) {
          return (
            <div
              key={key}
              className="deco deco--perforation"
              style={{ top: pctY(d.y), width: pctX(d.szerokosc ?? 186), left: pctX(12) }}
            />
          );
        }

        if (d.typ === 'spirala' && d.cx != null) {
          return (
            <div
              key={key}
              className="deco deco--spiral"
              style={{
                left: pctX((d.cx ?? 198) - (d.promien ?? 80)),
                top: pctY((d.cy ?? 164) - (d.promien ?? 80)),
                width: pctX((d.promien ?? 80) * 2),
                height: pctY((d.promien ?? 80) * 2),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
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
                left: pctX(d.x),
                top: pctY(d.y ?? 0),
                width: pctX(d.szerokosc ?? 166),
                height: pctY(d.wysokosc ?? 164),
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
                left: pctX(x),
                top: pctY(y),
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
              style={{ left: pctX(d.x), top: pctY(d.y ?? 0), borderColor: d.kolor ?? '#FFF9F0' }}
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
              style={{ ...mmPosStyle(d.obszar), background: d.kolor ?? 'rgba(0,0,0,0.45)' }}
            />
          );
        }

        return null;
      })}
    </>
  );
}
