import type { StrefaKalendarza } from '../../types/plan';
import { getMonthDaysWithImieniny } from '../../utils/imieniny';
import { usePageSize } from '../../context/PageSizeContext';
import { mmPosStyle, zoneCssVars } from '../../utils/previewUtils';
import { PrintCalendarGrid } from './PrintCalendarGrid';
import './PlannerCalendarGrid.css';

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

interface PlannerCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  plannerTyp: string;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  dayFontSize?: number;
  monthTitle?: MonthTitleProps;
}

export function PlannerCalendarGrid({
  year,
  monthIndex = 0,
  area,
  plannerTyp,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  dayFontSize = 7,
  monthTitle,
}: PlannerCalendarGridProps) {
  const { pageW, pageH, layoutScale = 1 } = usePageSize();
  const days = getMonthDaysWithImieniny(year, monthIndex).filter((d) => d.isCurrentMonth && d.day);
  const compact = area.szerokosc < 95;

  const title = monthTitle ?? {
    monthName: 'Styczeń',
    year,
    fontFamily: headingFont,
    color: accentColor,
    fontSize: compact ? 'calc(9 * 100cqw / var(--zone-w-mm, 74))' : 'calc(11 * 100cqw / var(--zone-w-mm, 186))',
  };

  return (
    <div
      className={`planner-cal planner-cal--${plannerTyp}`}
      style={{
        ...mmPosStyle(area, pageW, pageH, layoutScale),
        ...zoneCssVars(area),
        color: textColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      <div className="planner-cal__kalendarium">
        <PrintCalendarGrid
          year={year}
          monthIndex={monthIndex}
          area={area}
          textColor={textColor}
          accentColor={accentColor}
          dayFontSize={dayFontSize}
          compact
          embedded
          headingFont={headingFont}
          bodyFont={bodyFont}
          showImieniny
          monthTitle={title}
        />
      </div>
      <div className="planner-cal__panel">
        {renderPlannerPanel(plannerTyp, days, accentColor)}
      </div>
    </div>
  );
}

function renderPlannerPanel(
  typ: string,
  days: { day: number | null; imieniny: string; isWeekend: boolean }[],
  accent: string,
) {
  switch (typ) {
    case 'planer-tygodniowy':
      return (
        <div className="planner-cal__weeks">
          {[0, 1, 2, 3, 4].map((w) => (
            <div key={w} className="planner-cal__week-block">
              <span className="planner-cal__week-label">Tydzień {w + 1}</span>
              <div className="planner-cal__lines"><span /><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-nawyki':
      return (
        <div className="planner-cal__habits">
          {['Woda', 'Sport', 'Sen', 'Czytanie'].map((h) => (
            <div key={h} className="planner-cal__habit-row">
              <span>{h}</span>
              <div className="planner-cal__checks">
                {days.slice(0, 10).map((_, i) => (
                  <span key={i} className="planner-cal__check" style={{ borderColor: accent }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'planer-cele':
      return (
        <div className="planner-cal__goals">
          <span className="planner-cal__section-title">Cele miesiąca</span>
          <div className="planner-cal__lines"><span /><span /><span /><span /></div>
        </div>
      );

    case 'planer-kanban':
      return (
        <div className="planner-cal__kanban">
          {['Do zrobienia', 'W toku', 'Zrobione'].map((col) => (
            <div key={col} className="planner-cal__kanban-col">
              <span className="planner-cal__section-title">{col}</span>
              <div className="planner-cal__lines"><span /><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-czas':
      return (
        <div className="planner-cal__hours">
          {['7:00', '9:00', '11:00', '13:00', '15:00', '17:00'].map((h) => (
            <div key={h} className="planner-cal__hour-row">
              <span className="planner-cal__hour">{h}</span>
              <span className="planner-cal__hour-line" />
            </div>
          ))}
        </div>
      );

    case 'planer-finanse':
      return (
        <div className="planner-cal__finance">
          {['Przychody', 'Rachunki', 'Oszczędności'].map((cat) => (
            <div key={cat} className="planner-cal__finance-row">
              <span>{cat}</span>
              <span className="planner-cal__finance-val">______ zł</span>
            </div>
          ))}
        </div>
      );

    case 'planer-wellness':
      return (
        <div className="planner-cal__wellness">
          {['Śniadanie', 'Medytacja', 'Spacer', 'Sen 8h'].map((item) => (
            <label key={item} className="planner-cal__wellness-item">
              <span className="planner-cal__check" style={{ borderColor: accent }} />
              {item}
            </label>
          ))}
        </div>
      );

    case 'planer-priorytety':
      return (
        <div className="planner-cal__kanban planner-cal__kanban--2">
          {['Pilne', 'Ważne', 'Później', 'Deleguj'].map((col) => (
            <div key={col} className="planner-cal__kanban-col">
              <span className="planner-cal__section-title">{col}</span>
              <div className="planner-cal__lines"><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-menu':
      return (
        <div className="planner-cal__menu">
          {['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'].map((d) => (
            <div key={d} className="planner-cal__menu-day">
              <span className="planner-cal__section-title">{d}</span>
              <div className="planner-cal__lines"><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-trening':
      return (
        <div className="planner-cal__habits">
          {['Rozgrzewka', 'Siła', 'Cardio'].map((h) => (
            <div key={h} className="planner-cal__habit-row">
              <span>{h}</span>
              <div className="planner-cal__checks">
                {days.slice(0, 7).map((_, i) => (
                  <span key={i} className="planner-cal__check" style={{ borderColor: accent }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'planer-czytanie':
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Lista lektur</span>
          {['Tytuł 1', 'Tytuł 2', 'Tytuł 3'].map((t) => (
            <div key={t} className="planner-cal__note-row">
              <span className="planner-cal__check" style={{ borderColor: accent }} />
              <span className="planner-cal__note-line" />
              <small>{t}</small>
            </div>
          ))}
        </div>
      );

    case 'planer-podroze':
      return (
        <div className="planner-cal__finance">
          {['Cel', 'Budżet', 'Bilety'].map((cat) => (
            <div key={cat} className="planner-cal__finance-row">
              <span>{cat}</span>
              <span className="planner-cal__finance-val">______</span>
            </div>
          ))}
        </div>
      );

    case 'planer-urodziny':
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Notatki urodzinowe</span>
          <div className="planner-cal__lines"><span /><span /><span /></div>
        </div>
      );

    case 'planer-rodzina':
      return (
        <div className="planner-cal__weeks">
          {[0, 1, 2, 3].map((w) => (
            <div key={w} className="planner-cal__week-block">
              <span className="planner-cal__week-label">Tydzień {w + 1}</span>
              <div className="planner-cal__lines"><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-projekt':
      return (
        <div className="planner-cal__kanban">
          {['Backlog', 'Sprint', 'Review'].map((col) => (
            <div key={col} className="planner-cal__kanban-col">
              <span className="planner-cal__section-title">{col}</span>
              <div className="planner-cal__lines"><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-gratitude':
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Wdzięczność</span>
          <div className="planner-cal__lines"><span /><span /><span /></div>
        </div>
      );

    case 'planer-zakupy':
      return (
        <div className="planner-cal__wellness">
          {['Warzywa', 'Owoce', 'Nabiał', 'Inne'].map((item) => (
            <label key={item} className="planner-cal__wellness-item">
              <span className="planner-cal__check" style={{ borderColor: accent }} />
              {item}
            </label>
          ))}
        </div>
      );

    case 'planer-kontakty':
      return (
        <div className="planner-cal__finance">
          {['Rodzina', 'Praca', 'Znajomi'].map((cat) => (
            <div key={cat} className="planner-cal__finance-row">
              <span>{cat}</span>
              <span className="planner-cal__finance-val">tel. ___</span>
            </div>
          ))}
        </div>
      );

    case 'planer-nauka':
      return (
        <div className="planner-cal__habits">
          {['Lekcja', 'Powtórka', 'Test'].map((h) => (
            <div key={h} className="planner-cal__habit-row">
              <span>{h}</span>
              <div className="planner-cal__checks">
                {days.slice(0, 8).map((_, i) => (
                  <span key={i} className="planner-cal__check" style={{ borderColor: accent }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case 'planer-notatki':
    default:
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Notatki</span>
          <div className="planner-cal__lines"><span /><span /><span /><span /></div>
        </div>
      );
  }
}
