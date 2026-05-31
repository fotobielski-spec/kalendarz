# Model produktu — aplikacja webowa, sprzedaż online

## Założenie biznesowe

**Dokumenty ID Web** to **niezależna** aplikacja **e-commerce w przeglądarce** — nie łączy się ze starym programem desktop. Klient obsługuje proces na swoim urządzeniu. **Nie ma sprzedaży stacjonarnej** ani kiosku.

| Było (odrzucone) | Jest (docelowe) |
|------------------|-----------------|
| Stanowisko / kiosk w salonie | Strona www — użytkownik wchodzi z dowolnego urządzenia |
| QR jako główny flow kiosk→telefon | Capture w przeglądarce; QR **opcjonalnie** (desktop → kontynuuj na telefonie) |
| Odbiór wydruku w punkcie | Wyłącznie **dostawa online**: e-mail i/lub **wysyłka kurierska** |
| Płatność na miejscu | **Wyłącznie płatność online** (Stripe) |

## Produkty (sklep internetowy)

| Kod | Nazwa dla klienta | Realizacja |
|-----|-------------------|------------|
| `digital_email` | Zdjęcia cyfrowe na e-mail | Po opłaceniu: linki signed URL / bezpieczna wysyłka plików |
| `digital_email_print_shipped` | Cyfrowe + wydruk z wycięciem (wysyłka) | Pliki na e-mail + zamówienie wydruku do **adresu dostawy** (fulfillment magazyn/drukarnia) |

Brak produktu „odbiór osobisty” / „płatność przy ladzie”.

## Przepływ użytkownika (web)

1. Wejście na stronę (SEO / link bezpośredni).
2. „Zrób zdjęcie” — na **mobile**: aparat lub upload; na **desktop**: upload lub opcjonalny QR „otwórz na telefonie”.
3. Maska biometryczna + analiza (moduł `packages/processing` w tej aplikacji).
4. Po 100% — podgląd miniatury (watermark).
5. Koszyk → dane e-mail (+ adres przy wysyłce wydruku) → **płatność online**.
6. Potwierdzenie zamówienia + dostawa cyfrowa / status wysyłki.

## Sesja

Sesja to **koszyk techniczny** powiązany z jednym zdjęciem w trakcie wizyty w sklepie online (analogicznie do session ID w e-commerce), nie „token stanowiska”.

TTL sesji: krótki (np. 30–60 min) — porzucone sesje = porzucony koszyk.
