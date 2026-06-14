import imieninyData from '../../data/imieniny.json';

type ImieninyMap = Record<string, Record<string, string[]>>;

const data = imieninyData as ImieninyMap;

export function getImieniny(month: number, day: number): string[] {
  const names = data[String(month)]?.[String(day)];
  return names ?? [];
}

/** Skrócona forma do komórki kalendarza (max ~10 znaków) */
export function formatImieninyShort(month: number, day: number, maxLen = 11): string {
  const names = getImieniny(month, day);
  if (names.length === 0) return '';
  const first = names[0].replace(/'ego$/, '').replace(/'ej$/, '');
  if (first.length <= maxLen) return first;
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
