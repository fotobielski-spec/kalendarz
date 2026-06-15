import type { StrefaKalendarza } from '../../types/plan';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import './BottomStripCalendarGrid.css';

interface BottomStripCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  monthName: string;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  backgroundColor?: string;
  /** Rok w prawym górnym rogu strony (mm od góry obszaru roboczego) */
  yearTopMm?: number;
  yearRightMm?: number;
}

export function BottomStripCalendarGrid({
  year,
  monthIndex = 0,
  area,
  monthName,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  backgroundColor,
  yearTopMm = 6,
  yearRightMm = 4,
}: BottomStripCalendarGridProps) {
  const { pageW, pageH } = usePageSize();
  const today = new Date();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startOffset = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const yearX = area.x + area.szerokosc - yearRightMm;

  return (
    <>
      <div
        className="strip-cal__year"
        style={{
          position: 'absolute',
          left: `${(yearX / pageW) * 100}%`,
          top: `${((12 + yearTopMm) / pageH) * 100}%`,
          fontFamily: headingFont,
          color: accentColor,
          transform: 'translateX(-100%)',
        }}
        aria-hidden
      >
        {year}
      </div>

      <div
        className="strip-cal"
        style={{
          ...mmPosStyle(area, pageW, pageH),
          position: 'absolute',
          color: textColor,
          background: backgroundColor,
          ...zoneCssVars(area),
          '--font-heading': headingFont,
          '--font-body': bodyFont,
          '--accent': accentColor,
        } as React.CSSProperties}
      >
        <span className="strip-cal__month" style={{ fontFamily: headingFont }}>
          {monthName}
        </span>
        <div className="strip-cal__row" style={{ fontFamily: bodyFont }}>
          {cells.map((day, i) => {
            const isToday =
              day != null &&
              day === today.getDate() &&
              today.getMonth() === monthIndex &&
              year === today.getFullYear();
            return (
              <span
                key={i}
                className={[
                  'strip-cal__cell',
                  day == null && 'strip-cal__cell--empty',
                  isToday && 'strip-cal__cell--today',
                ].filter(Boolean).join(' ')}
              >
                {day ?? ''}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
