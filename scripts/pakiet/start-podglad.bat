@echo off
title Kalendarium+ Podglad
cd /d "%~dp0"
echo.
echo  Kalendarium+ - uruchamianie podgladu...
echo  Nie zamykaj tego okna!
echo.
echo  Za chwile otworzy sie przegladarka:
echo  http://localhost:3000/OTWORZ-PODGLAD.html
echo.
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000/OTWORZ-PODGLAD.html"
npx --yes serve -l 3000
pause
