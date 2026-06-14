/**
 * Audyt układów kalendarzy — strefy, typografia, nakładanie
 * node scripts/audit-layouts.mjs
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../data');

const A4_W = 210;
const A4_H = 297;
const M = 12;
const CONTENT_W = 186;
const CONTENT_H = 273;

function overlap(a, b) {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

function zoneBox(z) {
  const p = z.pozycja ?? z;
  return { x: p.x, y: p.y, w: p.szerokosc, h: p.wysokosc };
}

function auditKalendarium(k, source) {
  const issues = [];
  const jan = k.strony?.find((s) => s.typ === 'miesiac' && (s.miesiac === 1 || s.etykieta === 'Styczeń'));
  if (!jan) {
    issues.push({ level: 'error', msg: 'Brak strony stycznia' });
    return issues;
  }

  const cal = jan.strefaKalendarza;
  if (!cal?.szerokosc || !cal?.wysokosc) {
    issues.push({ level: 'error', msg: 'Brak strefyKalendarza' });
    return issues;
  }

  if (cal.x < M - 1 || cal.y < M - 1) {
    issues.push({ level: 'warn', msg: `Kalendarz poza marginesem (${cal.x},${cal.y})` });
  }
  if (cal.x + cal.szerokosc > M + CONTENT_W + 1) {
    issues.push({ level: 'warn', msg: 'Kalendarz wychodzi poza szerokość treści' });
  }
  if (cal.y + cal.wysokosc > M + CONTENT_H + 1) {
    issues.push({ level: 'warn', msg: 'Kalendarz wychodzi poza wysokość treści' });
  }

  const daySize = k.typografia?.rozmiarDzien ?? 9;
  if (cal.szerokosc < 95 && daySize < 7.5) {
    issues.push({ level: 'warn', msg: `Wąska strefa (${cal.szerokosc}mm) + mały rozmiarDzien (${daySize})` });
  }

  if (!k.typografia?.naglowek || !k.typografia?.tekst) {
    issues.push({ level: 'warn', msg: 'Brak definicji czcionek' });
  }

  const intentionalOverlap =
    /diagonal|double|duet|overlay|fullscreen|polaroid|action|frosted|spiral|L-frame|wave-divider|imperial|split/i.test(jan.uklad ?? '') ||
    jan.efektyStrony?.frostedGlass ||
    jan.efektyStrony?.panelPolprzezroczysty ||
    cal.uklad === 'pionowy';

  const photos = (jan.strefyZdjec ?? []).map(zoneBox);
  const calBox = { x: cal.x, y: cal.y, w: cal.szerokosc, h: cal.wysokosc };

  for (const [i, ph] of photos.entries()) {
    if (overlap(calBox, ph) && !intentionalOverlap) {
      issues.push({ level: 'error', msg: `Nakładanie: kalendarz ∩ foto[${i}]` });
    }
  }

  for (let i = 0; i < photos.length; i++) {
    for (let j = i + 1; j < photos.length; j++) {
      if (overlap(photos[i], photos[j])) {
        issues.push({ level: 'warn', msg: `Nakładanie: foto[${i}] ∩ foto[${j}]` });
      }
    }
  }

  const deko = (jan.dekoracje ?? []).filter((d) => d.szerokosc && d.wysokosc);
  for (const [i, d] of deko.entries()) {
    const box = {
      x: d.x ?? d.pozycja?.x ?? 0,
      y: d.y ?? d.pozycja?.y ?? 0,
      w: d.szerokosc ?? 0,
      h: d.wysokosc ?? d.grubosc ?? 0,
    };
    if (overlap(calBox, box)) {
      issues.push({ level: 'warn', msg: `Dekoracja[${i}] nachodzi na kalendarz` });
    }
  }

  return issues;
}

const files = readdirSync(DATA).filter((f) => f.startsWith('plan-kalendaria') && f.endsWith('.json'));
let total = 0;
let errors = 0;
let warns = 0;
const byId = [];

for (const file of files) {
  const plan = JSON.parse(readFileSync(join(DATA, file), 'utf8'));
  for (const k of plan.kalendaria ?? []) {
    total++;
    const issues = auditKalendarium(k, file);
    const errs = issues.filter((i) => i.level === 'error');
    const wns = issues.filter((i) => i.level === 'warn');
    errors += errs.length;
    warns += wns.length;
    if (issues.length) {
      byId.push({ id: k.id, file, issues });
    }
  }
}

console.log(`\nAudyt: ${total} kalendarzy w ${files.length} plikach`);
console.log(`Błędy: ${errors} · Ostrzeżenia: ${warns}\n`);

for (const row of byId.sort((a, b) => a.id.localeCompare(b.id))) {
  console.log(`${row.id} (${row.file})`);
  for (const i of row.issues) {
    console.log(`  [${i.level}] ${i.msg}`);
  }
}

if (errors > 0) process.exit(1);
