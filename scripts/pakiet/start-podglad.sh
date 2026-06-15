#!/usr/bin/env bash
cd "$(dirname "$0")"
echo ""
echo " Kalendarium+ — uruchamianie podglądu..."
echo " Nie zamykaj tego terminala!"
echo ""
echo " Otwórz w przeglądarce:"
echo " http://localhost:3000/OTWORZ-PODGLAD.html"
echo ""
if command -v npx >/dev/null 2>&1; then
  (sleep 2 && xdg-open "http://localhost:3000/OTWORZ-PODGLAD.html" 2>/dev/null || open "http://localhost:3000/OTWORZ-PODGLAD.html" 2>/dev/null) &
  npx --yes serve -l 3000
elif command -v python3 >/dev/null 2>&1; then
  (sleep 1 && xdg-open "http://localhost:3000/OTWORZ-PODGLAD.html" 2>/dev/null) &
  python3 -m http.server 3000
else
  echo "Zainstaluj Node.js (npx) lub Python 3."
  exit 1
fi
