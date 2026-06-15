# Kalendarium+ — przekazanie projektu do czatu GPT

> Dokument przygotowany na podstawie pracy w Cursor (Cloud Agent).  
> Repo: `fotobielski-spec/kalendarz` · Branch: `cursor/kalendarium-plus-82fd` · PR: #6

---

## 1. Cel projektu

**Kalendarium+** — aplikacja do projektowania i podglądu kalendarzy ściennych **A4 pion** (210×297 mm) z miejscami na zdjęcia klienta. Każdy szablon ma 13 stron (okładka + 12 miesięcy); w przeglądarce podglądamy **styczeń**.

Dwa tryby:
1. **Aplikacja kalendarza wydarzeń** (React) — codzienny kalendarz z wydarzeniami
2. **Galeria podglądu szablonów druku** — wizualizacja układów, czcionek, imienin, stref foto

---

## 2. Stack techniczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | CSS (container queries `cqw`, zmienne CSS) |
| Dane | JSON (plany kalendarzy + imieniny) |
| Czcionki | Google Fonts (dynamiczne ładowanie) |
| Build | `npm run build` → `dist/` |

---

## 3. Uruchomienie

```bash
git clone https://github.com/fotobielski-spec/kalendarz
git checkout cursor/kalendarium-plus-82fd
npm install
npm run dev          # dev server http://localhost:5173
npm run build        # produkcja
npm start            # build + preview na :5173
```

**Ważne:** Vite ma `allowedHosts: true` (hosty Cursor VM).

---

## 4. Adresy URL

| URL | Opis |
|-----|------|
| `/` | Aplikacja Kalendarium+ (wydarzenia) |
| `/art` | **Główna galeria** — 75 szablonów (zalecane) |
| `/?view=art` | To samo co `/art` |
| `/?view=podglad` | 20 kalendarzy klasycznych |
| `/podglad-art.html` | Bezpośredni entry Art (bez routingu) |
| `/podglad.html` | Bezpośredni entry klasyczny |
| `/art?id=TEM-05` | Duży podgląd konkretnego szablonu |

---

## 5. Kolekcje kalendarzy (95 szablonów w galerii Art)

| Kolekcja | ID | Liczba | Plik JSON | Generator |
|----------|-----|--------|-----------|-----------|
| Klasyczne | KAL-01…20 | 20 | `plan-kalendaria-13s.json` | `generate-plan-kalendaria.mjs` |
| Art 40/60 | ART-01…30 | 30 | `plan-kalendaria-art-40-60.json` | `generate-plan-art-40-60.mjs` |
| Tematyczne | TEM-01…20 | 20 | `plan-kalendaria-tematyczne.json` | `generate-plan-tematyczne.mjs` |
| Pionowe | PION-01…05 | 5 | `plan-kalendaria-pionowe.json` | `generate-plan-pionowe.mjs` |
| Planery | PLAN-01…20 | 20 | `plan-kalendaria-planery.json` | `generate-plan-planery.mjs` |

**Galeria Art** (`ArtPreviewPage`) łączy: 30 + 20 + 5 + 20 = **75 kalendarzy**.

Proporcja standardowa: **40% kalendarium · 60% zdjęcie**.

---

## 6. Chronologia żądań użytkownika (rozmowa)

1. Utworzenie projektu Kalendarium+ (kalendarz wydarzeń)
2. Plan 20 kalendarzy 13-stronicowych A4 w JSON
3. Podgląd stycznia w przeglądarce
4. Naprawa linków (Vite `allowedHosts`)
5. 30 kalendarzy Art 40/60 + podgląd
6. Dopracowanie czcionek i układów (Google Fonts, etykiety)
7. Naprawa typografii (czcionki nachodziły — tytuł w strefie kalendarza)
8. **Imieniny** + 20 kalendarzy tematycznych (koty, psy, OSP…)
9. 5 kalendarzy pionowych (cyfry przy brzegu + imieniny) + ~20 planerów
10. Naprawa `/?view=art` (lazy load, trasa `/art`, render partiami)
11. **Planery muszą mieć kalendarium** — siatka 7×6 + imieniny nad panelem planera
12. **TEM-05 za mała czcionka** — audyt wszystkich układów, skalowanie względem strefy
13. **Duży podgląd** — lightbox po kliknięciu miniatury

---

## 7. Architektura kodu

```
src/
├── Root.tsx                 # Routing: app | podglad | art
├── App.tsx                  # Kalendarz wydarzeń
├── pages/
│   ├── ArtPreviewPage.tsx   # Merge 75 kalendarzy + filtry kolekcji
│   ├── ClassicPreviewPage.tsx
│   └── PreviewGallery.tsx   # Siatka + lightbox + URL ?id=
├── components/preview/
│   ├── MonthPagePreview.tsx # Renderer strony A4 (główny)
│   ├── PrintCalendarGrid.tsx    # Siatka 7×6 + imieniny
│   ├── VerticalCalendarGrid.tsx # Lista pionowa dni (PION-*)
│   ├── PlannerCalendarGrid.tsx  # Kalendarium + panel planera
│   ├── PreviewLightbox.tsx      # Duży podgląd
│   ├── PhotoZone.tsx
│   ├── PageDecorations.tsx
│   ├── LayoutZones.tsx
│   └── RadialCalendarGrid.tsx
├── utils/
│   ├── typographyFit.ts   # fitTitleInCalendarZone, fitDayFontSize
│   ├── fonts.ts           # Google Fonts
│   ├── imieniny.ts
│   ├── layoutLabels.ts    # Polskie etykiety układów
│   └── previewUtils.ts    # mm→%, zoneCssVars, isSidebarCalendarZone
└── types/plan.ts

data/
├── imieniny.json
├── plan-kalendaria-*.json   # 5 plików planów

scripts/
├── generate-plan-*.mjs      # 5 generatorów
└── audit-layouts.mjs        # Audyt nakładania stref
```

---

## 8. Logika renderowania (MonthPagePreview)

Dla strony stycznia wybiera komponent wg `strefaKalendarza.uklad` / `page.uklad`:

| Warunek | Komponent |
|---------|-----------|
| `uklad === 'radialny'` | RadialCalendarGrid |
| `uklad === 'pionowy'` lub `pion-lista*` | VerticalCalendarGrid |
| `uklad === 'planer'` | PlannerCalendarGrid (kalendarium + panel) |
| `fullscreen` / `overlay` | PrintCalendarGrid na tle foto |
| domyślnie | PrintCalendarGrid |

**Planer:** góra ~62% = `PrintCalendarGrid` (embedded), dół = panel (nawyki, kanban, notatki…).

**Pionowy:** cyfry 1–31 przy lewym/prawym brzegu + imieniny (`krawedz: 'lewo'|'prawo'`).

---

## 9. Kluczowe rozwiązania techniczne

### Typografia (naprawione)
- Czcionki skalowane względem **`--zone-w-mm`** (szerokość strefy kalendarza), nie całego A4 (210 mm)
- Wąskie kolumny boczne (~74 mm, np. TEM-05): klasa `print-cal--sidebar`
- `fitDayFontSize()` — łagodniejsze kary dla wysokich kolumn bocznych
- Tytuł miesiąca wewnątrz strefy kalendarza (`fitTitleInCalendarZone`)

### Wydajność galerii
- Lazy import `ArtPreviewPage` / `ClassicPreviewPage`
- Render partiami po 12 miniaturek
- Lightbox ładuje jeden szablon w dużym rozmiarze (~720 px)

### Imieniny
- `data/imieniny.json` — cały rok
- `formatImieninyShort()` — skrót pod komórkę (długość zależy od szerokości strefy)

---

## 10. Typy danych (skrót)

```typescript
interface Kalendarium {
  id: string;           // np. "TEM-05"
  nazwa: string;
  kategoria: string;
  kolekcja?: 'art' | 'tematyczne' | 'pionowe' | 'planery';
  paleta: { tlo, akcent, tekst, ... };
  typografia: { naglowek, tekst, rozmiarMiesiac, rozmiarDzien };
  proporcja?: { kalendarium: 40, zdjecie: 60 };
  strony: StronaMiesiaca[];  // 12 miesięcy + ewent. okładka
}

interface StrefaKalendarza {
  x, y, szerokosc, wysokosc;  // mm, margines M=12
  uklad?: 'planer' | 'pionowy' | 'radialny';
  krawedz?: 'lewo' | 'prawo';
  plannerTyp?: string;  // np. 'planer-nawyki'
}
```

Format A4 treści: **W=186 mm, H=273 mm** (margines 12 mm).  
Układ 60/40: `PW=112` (foto), `CW=74` (kalendarz w kolumnie bocznej).

---

## 11. Przykłady szablonów

| ID | Nazwa | Układ |
|----|-------|-------|
| TEM-05 | Labrador Retriever | Foto prawo 60%, kalendarz lewa kolumna 74 mm |
| PION-01 | Lista lewa — krawędź | Pionowa lista dni + imieniny przy lewym brzegu |
| PLAN-01 | Tygodniowy Master | Siatka miesiąca + panel tygodniowy |
| ART-01 | Złota Godzina | Foto góra 60%, kalendarz dół 40% |

---

## 12. Komendy pomocnicze

```bash
node scripts/generate-plan-tematyczne.mjs
node scripts/generate-plan-art-40-60.mjs
node scripts/generate-plan-pionowe.mjs
node scripts/generate-plan-planery.mjs
node scripts/audit-layouts.mjs   # sprawdza nakładanie stref
```

---

## 13. Znane ograniczenia / do zrobienia

- [ ] Podgląd tylko **stycznia** (nie wszystkie 12 miesięcy na raz)
- [ ] Eksport do PDF / druku — brak
- [ ] Upload prawdziwych zdjęć klienta — placeholdery gradientów
- [ ] Audyt: 2 układy celowo zachodzą (ART-13 okrąg, KAL-18 split)
- [ ] Chunk ArtPreviewPage ~600 KB — możliwy code-split per kolekcja
- [ ] Okładki w JSON istnieją, ale renderer skupia się na `typ: 'miesiac'`

---

## 14. Ostatnie commity (branch)

```
f7cc792 Dodaj duży podgląd kalendarza (lightbox) w galerii
03b947c Popraw czytelność czcionek w wąskich strefach (TEM-05) + audyt układów
73609d1 Planery z pełnym kalendarium — siatka miesiąca + imieniny
7077f5a Napraw podgląd Art: lazy load, /art, stopniowe renderowanie
4d8c746 Dodaj 5 kalendarzy pionowych i 20 planerów z podglądem
46d7ce3 feat: imieniny, poprawa typografii i 20 kalendarzy tematycznych
```

---

## 15. Prompt startowy dla GPT (wklej poniżej)

```
Pracuję nad projektem Kalendarium+ (repo: fotobielski-spec/kalendarz, branch: cursor/kalendarium-plus-82fd).

To aplikacja React/Vite/TypeScript do podglądu kalendarzy ściennych A4 pion ze zdjęciami klienta.
Mamy 95 szablonów w JSON (Art, Tematyczne, Pionowe, Planery, Klasyczne).
Galeria: /art (75 szablonów), lightbox po kliknięciu, URL ?id=TEM-05.

Kluczowe pliki:
- src/components/preview/MonthPagePreview.tsx — renderer
- src/pages/PreviewGallery.tsx — galeria + lightbox
- data/plan-kalendaria-*.json — dane szablonów
- scripts/generate-plan-*.mjs — generatory

Typografia skaluje się względem --zone-w-mm (szerokość strefy kalendarza).
Planery = PrintCalendarGrid (góra) + panel planera (dół).
Pionowe = VerticalCalendarGrid z imieninami przy brzegu.

[Kontynuuj od: opisz swoje zadanie]
```

---

*Wygenerowano: czerwiec 2026*
