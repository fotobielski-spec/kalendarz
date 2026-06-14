import type { StrefaKalendarza } from '../../types/plan';
import { getMonthDaysWithImieniny } from '../../utils/imieniny';
import { mmPosStyle } from '../../utils/previewUtils';
import './PlannerCalendarGrid.css';

interface PlannerCalendarGridProps {
  year: number;
  monthIndex?: number;
  area: StrefaKalendarza;
  plannerTyp: string;
  textColor: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  monthName?: string;
  yearNum?: number;
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
  monthName = 'Styczeń',
  yearNum,
}: PlannerCalendarGridProps) {
  const days = getMonthDaysWithImieniny(year, monthIndex).filter((d) => d.isCurrentMonth && d.day);

  return (
    <div
      className={`planner-cal planner-cal--${plannerTyp}`}
      style={{
        ...mmPosStyle(area),
        color: textColor,
        '--font-heading': headingFont,
        '--font-body': bodyFont,
        '--accent': accentColor,
      } as React.CSSProperties}
    >
      <div className="planner-cal__head">
        <span style={{ fontFamily: headingFont }}>{monthName}</span>
        {yearNum && <span className="planner-cal__year">{yearNum}</span>}
      </div>
      {renderPlannerBody(plannerTyp, days, accentColor)}
    </div>
  );
}

function renderPlannerBody(
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
              <div className="planner-cal__week-days">
                {days.slice(w * 7, w * 7 + 7).map((d, i) => (
                  <span key={i} className={`planner-cal__mini-day${d.isWeekend ? ' planner-cal__mini-day--we' : ''}`}>
                    <b>{d.day}</b>
                    <small>{d.imieniny}</small>
                  </span>
                ))}
              </div>
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
        <>
          <div className="planner-cal__goals">
            <span className="planner-cal__section-title">Cele miesiąca</span>
            <div className="planner-cal__lines"><span /><span /><span /></div>
          </div>
          <div className="planner-cal__mini-grid">
            {days.map((d) => (
              <span key={d.day} className="planner-cal__mini-cell">{d.day}</span>
            ))}
          </div>
        </>
      );

    case 'planer-kanban':
      return (
        <div className="planner-cal__kanban">
          {['Do zrobienia', 'W toku', 'Zrobione'].map((col) => (
            <div key={col} className="planner-cal__kanban-col">
              <span className="planner-cal__section-title">{col}</span>
              <div className="planner-cal__lines"><span /><span /><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-czas':
      return (
        <div className="planner-cal__hours">
          {['7:00', '9:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map((h) => (
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
          {['Przychody', 'Rachunki', 'Oszczędności', 'Inne'].map((cat) => (
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
          {['Śniadanie', 'Medytacja', 'Spacer', 'Woda 2L', 'Sen 8h'].map((item) => (
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
              <div className="planner-cal__lines"><span /><span /><span /></div>
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
              <div className="planner-cal__lines"><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-trening':
      return (
        <div className="planner-cal__habits">
          {['Rozgrzewka', 'Siła', 'Cardio', 'Stretching'].map((h) => (
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
          {['Tytuł 1', 'Tytuł 2', 'Tytuł 3', 'Tytuł 4', 'Tytuł 5'].map((t) => (
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
          {['Cel podróży', 'Budżet', 'Bilety', 'Noclegi'].map((cat) => (
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
          <span className="planner-cal__section-title">Urodziny w miesiącu</span>
          {days.filter((d) => d.imieniny).slice(0, 10).map((d) => (
            <div key={d.day} className="planner-cal__note-row">
              <span className="planner-cal__note-day" style={{ color: accent }}>{d.day}</span>
              <span className="planner-cal__note-line" />
              <small className="planner-cal__note-name">{d.imieniny}</small>
            </div>
          ))}
        </div>
      );

    case 'planer-rodzina':
      return (
        <div className="planner-cal__weeks">
          {[0, 1, 2, 3].map((w) => (
            <div key={w} className="planner-cal__week-block">
              <span className="planner-cal__week-label">Tydzień rodzinny {w + 1}</span>
              <div className="planner-cal__lines"><span /><span /><span /></div>
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
              <div className="planner-cal__lines"><span /><span /><span /><span /></div>
            </div>
          ))}
        </div>
      );

    case 'planer-gratitude':
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Za co jestem wdzięczny/a</span>
          {days.slice(0, 6).map((d) => (
            <div key={d.day} className="planner-cal__note-row">
              <span className="planner-cal__note-day" style={{ color: accent }}>{d.day}</span>
              <span className="planner-cal__note-line" />
            </div>
          ))}
        </div>
      );

    case 'planer-zakupy':
      return (
        <div className="planner-cal__wellness">
          {['Warzywa', 'Owoce', 'Nabiał', 'Pieczywo', 'Inne'].map((item) => (
            <label key={item} className="planner-cal__wellness-item">
              <span className="planner-cal__check" style={{ borderColor: accent }} />
              {item}
              <span className="planner-cal__note-line" style={{ flex: 1, margin: '0 0 0 8px' }} />
            </label>
          ))}
        </div>
      );

    case 'planer-kontakty':
      return (
        <div className="planner-cal__finance">
          {['Rodzina', 'Praca', 'Znajomi', 'Usługi'].map((cat) => (
            <div key={cat} className="planner-cal__finance-row">
              <span>{cat}</span>
              <span className="planner-cal__finance-val">tel. ______</span>
            </div>
          ))}
        </div>
      );

    case 'planer-nauka':
      return (
        <div className="planner-cal__habits">
          {['Lekcja', 'Powtórka', 'Notatki', 'Test'].map((h) => (
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
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Notatki</span>
          {days.slice(0, 8).map((d) => (
            <div key={d.day} className="planner-cal__note-row">
              <span className="planner-cal__note-day" style={{ color: accent }}>{d.day}</span>
              <span className="planner-cal__note-line" />
              <small className="planner-cal__note-name">{d.imieniny}</small>
            </div>
          ))}
          <div className="planner-cal__lines"><span /><span /><span /></div>
        </div>
      );

    default:
      return (
        <div className="planner-cal__notes">
          <span className="planner-cal__section-title">Notatki</span>
          {days.slice(0, 8).map((d) => (
            <div key={d.day} className="planner-cal__note-row">
              <span className="planner-cal__note-day" style={{ color: accent }}>{d.day}</span>
              <span className="planner-cal__note-line" />
              <small className="planner-cal__note-name">{d.imieniny}</small>
            </div>
          ))}
          <div className="planner-cal__lines"><span /><span /><span /></div>
        </div>
      );
  }
}
