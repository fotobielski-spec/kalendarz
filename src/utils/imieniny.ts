import imieninyData from '../../data/imieniny.json';

type ImieninyMap = Record<string, Record<string, string[]>>;

const data = imieninyData as ImieninyMap;

export function getImieniny(month: number, day: number): string[] {
  const names = data[String(month)]?.[String(day)];
  return names ?? [];
}

/** Pełna nazwa imienin do komórki — bez skracania i bez „…” */
export function formatImieninyCell(month: number, day: number): string {
  const names = getImieniny(month, day);
  if (names.length === 0) return '';
  return names.join(', ');
}

/** @deprecated Użyj formatImieninyCell — zachowane dla kompatybilności */
export function formatImieninyShort(month: number, day: number, _maxLen = 99, _full = true): string {
  return formatImieninyCell(month, day);
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
      imieniny: isCurrentMonth ? formatImieninyCell(monthIndex + 1, d) : '',
    });
  }
  return days;
}
