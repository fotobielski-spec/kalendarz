# Kalendarz

Prosta aplikacja kalendarza po polsku.

## Uruchomienie

Otwórz `index.html` w przeglądarce lub uruchom lokalny serwer:

```bash
python3 -m http.server 8080
```

Następnie wejdź na http://localhost:8080

## Widoki

- **Miesiąc** – siatka całego miesiąca (poniedziałek jako pierwszy dzień tygodnia).
- **Tydzień** – siedem dni bieżącego tygodnia, z zakresem dat w nagłówku.
- **Dzień** – pojedynczy dzień z pełną nazwą dnia tygodnia.
- Przyciski `‹` / `›` przesuwają widok o miesiąc, tydzień lub dzień (zależnie od aktywnego widoku), a przycisk **Dziś** wraca do bieżącej daty.

## Język i menu

- Interfejs i menu są po polsku (`lang="pl"`).
- Wyłączone sprawdzanie pisowni (`spellcheck="false"`), żeby polskie etykiety nie były podkreślane jako błędy.
- Pozycje menu nie mają podkreślenia wizualnego (styl przycisków, nie linków).
