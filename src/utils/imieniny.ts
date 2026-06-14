import imieninyData from '../../data/imieniny.json';

type ImieninyMap = Record<string, Record<string, string[]>>;

const data = imieninyData as ImieninyMap;

export function getImieniny(month: number, day: number): string[] {
  const names = data[String(month)]?.[String(day)];
  return names ?? [];
}

/** Genitive (dopełniacz) → krótsza forma nominativu do wyświetlenia */
export function normalizeImieninyName(name: string): string {
  if (!name || name === 'Nowy Rok') return name;
  if (name.endsWith('iego')) return name.slice(0, -3) + 'i';
  if (name.endsWith('ego')) return name.slice(0, -3);
  if (name.endsWith('ej')) return name.slice(0, -2) + 'a';
  if (name.endsWith('ki')) return name.slice(0, -1) + 'a';
  if (name.endsWith('y')) return name.slice(0, -1) + 'a';
  if (name.endsWith('i') && name.length > 3) return name.slice(0, -1) + 'a';
  return name;
}

/** Skrócona forma do komórki kalendarza; full = pełne imię (senior, zawijanie w CSS) */
export function formatImieninyShort(month: number, day: number, maxLen = 11, full = false): string {
  const names = getImieniny(month, day);
  if (names.length === 0) return '';
  const raw = names[0];
  const first = full ? normalizeImieninyName(raw) : raw.replace(/ego$/, '').replace(/ej$/, '');
  if (full || first.length <= maxLen) return first;
  return `${first.slice(0, maxLen - 1)}…`;
}

export function getMonthDaysWithImieniny(
  year: number,
  monthIndex: number,
): { day: number | null; isCurrentMonth: boolean; isWeekend: boolean; imieniny: string }[] {
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(year, monthIndex, 1 - startOffset);
  const days = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const isCurrentMonth = date.getMonth() === monthIndex;
    const dow = date.getDay();
    const d = date.getDate();
    days.push({
      day: isCurrentMonth ? d : null,
      isCurrentMonth,
      isWeekend: dow === 0 || dow === 6,
      imieniny: isCurrentMonth ? formatImieninyShort(monthIndex + 1, d) : '',
    });
  }
  return days;
}
