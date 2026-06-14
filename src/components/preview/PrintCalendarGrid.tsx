import type { StrefaKalendarza } from '../../types/plan';
import { formatImieninyShort, getImieniny, normalizeImieninyName } from '../../utils/imieniny';
import { fitDayFontSize, fitImieninyMaxLen } from '../../utils/typographyFit';
import { getDayLabels, isSidebarCalendarZone, mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import './PrintCalendarGrid.css';

interface MonthTitleProps {
  monthName: string;
  year: number;
  fontFamily?: string;
  color?: string;
  fontSize?: string;
  maxWidth?: string;
  textAlign?: 'left' | 'center' | 'right';
  transform?: string;
  letterSpacing?: string;
  fontWeight?: number;
  fontStyle?: string;
  textTransform?: string;
}

interface PrintCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  textColor: string;
  accentColor: string;
  dayFontSize?: number;
  compact?: boolean;
  backgroundColor?: string;
  headingFont?: string;
  bodyFont?: string;
  showImieniny?: boolean;
  senior?: boolean;
  monthTitle?: MonthTitleProps;
  /** Wewnątrz planera — bez pozycjonowania mm */
  embedded?: boolean;
}

export function PrintCalendarGrid({
  year,
  monthIndex = 0,
  area,
  textColor,
  accentColor,
  dayFontSize = 9,
  compact = false,
  backgroundColor,
  headingFont,
  bodyFont,
  showImieniny = true,
  senior = false,
  monthTitle,
  embedded = false,
}: PrintCalendarGridProps) {
  const labels = getDayLabels();
  const today = new Date();
  const fittedDaySize = fitDayFontSize(dayFontSize, area, showImieniny, senior);
  const isCompact = compact || area.szerokosc < 95;
  const isSidebar = isSidebarCalendarZone(area);
  const isSeniorShort = senior && area.wysokosc < 130;
  const imieninyMaxLen = fitImieninyMaxLen(area, senior);
  /** Skala imienin względem wysokości wiersza (krótka strefa kalendarza) */
  const seniorRowHmm = senior ? Math.max(12, (area.wysokosc - 14) / 6) : 0;
  const seniorImieninyScale = senior
    ? Math.min(1.05, Math.max(0.9, seniorRowHmm / 17))
    : 1;

  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);

  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === monthIndex;
    const dow = date.getDay();
    const d = date.getDate();
    return {
      day: isCurrentMonth ? d : null,
      isCurrentMonth,
      isWeekend: dow === 0 || dow === 6,
      imieniny: isCurrentMonth
        ? (senior
          ? normalizeImieninyName(getImieniny(monthIndex + 1, d)[0] ?? '')
          : (imieninyMaxLen > 0 ? formatImieninyShort(monthIndex + 1, d, imieninyMaxLen, false) : ''))
        : '',
      imieninyFull: isCurrentMonth ? getImieniny(monthIndex + 1, d).join(', ') : '',
    };
  });

  return (
    <div
      className={[
        'print-cal',
        isCompact && 'print-cal--compact',
        isSidebar && 'print-cal--sidebar',
        showImieniny && imieninyMaxLen > 0 && 'print-cal--imieniny',
        senior && 'print-cal--senior',
        isSeniorShort && 'print-cal--senior-compact',
        senior && area.szerokosc < 95 && 'print-cal--senior-side',
        embedded && 'print-cal--embedded',
      ].filter(Boolean).join(' ')}
      style={{
        ...(embedded
          ? { position: 'relative', width: '100%', height: '100%' }
          : mmPosStyle(area)),
        color: textColor,
        background: backgroundColor ?? (senior ? 'var(--senior-cal-bg, #fff)' : undefined),
        ...zoneCssVars(area),
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--day-size': fittedDaySize,
        '--accent': accentColor,
        ...(senior ? { '--senior-imieniny-scale': seniorImieninyScale } as React.CSSProperties : {}),
      } as React.CSSProperties}
    >
      {monthTitle && (
        <div
          className={[
            'print-cal__title',
            senior && 'print-cal__title--senior',
            isSeniorShort && 'print-cal__title--senior-inline',
          ].filter(Boolean).join(' ')}
          style={{
            fontFamily: monthTitle.fontFamily,
            color: monthTitle.color ?? accentColor,
            fontSize: monthTitle.fontSize,
            maxWidth: monthTitle.maxWidth ?? '100%',
            textAlign: monthTitle.textAlign ?? 'left',
            transform: monthTitle.transform,
            letterSpacing: monthTitle.letterSpacing,
            fontWeight: monthTitle.fontWeight,
            fontStyle: monthTitle.fontStyle,
            textTransform: monthTitle.textTransform,
          }}
        >
          <span className="print-cal__title-month">{monthTitle.monthName}</span>
          <span className="print-cal__title-year">{monthTitle.year}</span>
        </div>
      )}

      <div className="print-cal__labels">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`print-cal__label${i >= 5 ? ' print-cal__label--weekend' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>

      <div className="print-cal__grid">
        {days.map((d, i) => {
          const isToday =
            d.isCurrentMonth &&
            d.day === today.getDate() &&
            today.getMonth() === monthIndex &&
            year === today.getFullYear();
          return (
            <div
              key={i}
              className={[
                'print-cal__cell',
                !d.isCurrentMonth && 'print-cal__cell--muted',
                d.isWeekend && d.isCurrentMonth && 'print-cal__cell--weekend',
                isToday && 'print-cal__cell--today',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="print-cal__day-num">{d.day ?? ''}</span>
              {showImieniny && d.isCurrentMonth && d.day != null && (
                <span
                  className={['print-cal__imieniny', senior && 'print-cal__imieniny--senior'].filter(Boolean).join(' ')}
                  title={d.imieninyFull || d.imieniny || undefined}
                >
                  {d.imieniny}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
