#!/usr/bin/env node
/**
 * Buduje kalendarium-plus-pakiet.zip z podglądem (względne ścieżki)
 * node scripts/pakiet/build-zip.mjs
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');
const STAGE = join(ROOT, 'kalendarium-plus-pakiet');
const OUT = join(ROOT, 'kalendarium-plus-pakiet.zip');

console.log('Build projektu...');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

rmSync(STAGE, { recursive: true, force: true });
mkdirSync(join(STAGE, 'podglad'), { recursive: true });
mkdirSync(join(STAGE, 'zrodla'), { recursive: true });

cpSync(join(ROOT, 'dist'), join(STAGE, 'podglad'), { recursive: true });
cpSync(join(ROOT, 'scripts/pakiet/start-podglad.bat'), join(STAGE, 'podglad/start-podglad.bat'));
cpSync(join(ROOT, 'scripts/pakiet/start-podglad.sh'), join(STAGE, 'podglad/start-podglad.sh'));
cpSync(join(ROOT, 'src'), join(STAGE, 'zrodla/src'), { recursive: true });
cpSync(join(ROOT, 'data'), join(STAGE, 'zrodla/data'), { recursive: true });
cpSync(join(ROOT, 'scripts'), join(STAGE, 'zrodla/scripts'), { recursive: true });
cpSync(join(ROOT, 'docs'), join(STAGE, 'zrodla/docs'), { recursive: true });

for (const f of ['package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'index.html', 'podglad.html', 'podglad-art.html', 'POBIERANIE.txt']) {
  cpSync(join(ROOT, f), join(STAGE, f));
}
cpSync(join(ROOT, 'POBIERANIE.txt'), join(STAGE, 'zrodla/POBIERANIE.txt'));

writeFileSync(join(STAGE, 'URUCHOM-PODGLAD.txt'), `KALENDARIUM+ — JAK OTWORZYĆ PODGLĄD
================================

1. Wejdź do folderu:  podglad\\
2. Kliknij dwukrotnie:  start-podglad.bat   (Windows)
   lub uruchom:         start-podglad.sh    (Mac/Linux)
3. Poczekaj — otworzy się przeglądarka z galerią kalendarzy.

NIE otwieraj plików .html bezpośrednio z dysku (dwuklik) — nie zadziała!

Ręcznie (jeśli masz Node.js):
  cd podglad
  npx serve -l 3000
  http://localhost:3000/OTWORZ-PODGLAD.html

Galeria 75 szablonów:  podglad-art.html
Klasyczne 20:          podglad.html
`);

execSync(`cd "${STAGE}" && zip -r "${OUT}" . -x "*.DS_Store"`, { stdio: 'inherit' });
rmSync(STAGE, { recursive: true, force: true });
console.log(`\nGotowe: ${OUT}`);
