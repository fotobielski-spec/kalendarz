import type { StrefaKalendarza } from '../../types/plan';
import { getMonthDaysWithImieniny } from '../../utils/imieniny';
import { fitDayFontSize } from '../../utils/typographyFit';
import { getDayLabels, mmPosStyle } from '../../utils/previewUtils';
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
  monthTitle?: MonthTitleProps;
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
  monthTitle,
}: PrintCalendarGridProps) {
  const days = getMonthDaysWithImieniny(year, monthIndex);
  const labels = getDayLabels();
  const today = new Date();
  const fittedDaySize = fitDayFontSize(dayFontSize, area, showImieniny);
  const isCompact = compact || area.szerokosc < 95;

  return (
    <div
      className={`print-cal${isCompact ? ' print-cal--compact' : ''}${showImieniny ? ' print-cal--imieniny' : ''}`}
      style={{
        ...mmPosStyle(area),
        color: textColor,
        background: backgroundColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--day-size': fittedDaySize,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      {monthTitle && (
        <div
          className="print-cal__title"
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
              {showImieniny && d.isCurrentMonth && d.imieniny && (
                <span className="print-cal__imieniny" title={d.imieniny}>
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
