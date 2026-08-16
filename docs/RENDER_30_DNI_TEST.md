# Render - test 30 dni bez tunelu

Cel: zastapic niestabilny tunel stalym adresem API na czas testow.

## 1) Deploy silnika FOTOWAY (Python)

Silnik musi miec publiczny URL, bo API webowe laczy sie z nim przez `FOTOWAY_LEGACY_BASE_URL`.

1. W Render utworz nowy **Web Service** z repozytorium `FOTOWAY ID/backend`.
2. Ustaw:
   - Runtime: `Python`
   - Plan: `Free` (na testy)
   - Build Command:
     - `pip install --upgrade pip && pip install -r requirements.txt`
   - Start Command:
     - `BACKEND_HOST=0.0.0.0 BACKEND_PORT=$PORT python run.py`
3. Dodaj zmienne:
   - `ENV=production`
   - `CORS_ORIGINS=https://kalendarz-woad.vercel.app`
4. Po deployu skopiuj URL, np. `https://fotoway-id-engine.onrender.com`.

## 2) Deploy API (Node/Fastify)

W repo `kalendarz` jest gotowy blueprint: `render.api.yaml`.

1. W Render wybierz **Blueprint** i wskaz plik `render.api.yaml`.
2. Podczas tworzenia ustaw:
   - `FOTOWAY_LEGACY_BASE_URL=<URL z kroku 1>`
3. Poczekaj na deploy i skopiuj URL API, np. `https://dokumenty-id-api-test.onrender.com`.

Uwaga: `NODE_ENV=test` jest celowo ustawione, by API nie wymagalo Postgresa na czas szybkich testow.

## 3) Podpiecie Vercel

W projekcie `kalendarz` na Vercel:

1. `INTERNAL_API_BASE_URL=https://dokumenty-id-api-test.onrender.com/api/v1`
2. `NEXT_PUBLIC_API_BASE_URL=/api/v1`
3. Zrob redeploy produkcji.

## 4) Szybki test po wdrozeniu

- `https://kalendarz-woad.vercel.app/api/v1/health` -> powinno byc `200`
- `POST https://kalendarz-woad.vercel.app/api/v1/sessions` -> powinno zwracac `sessionId`

## Ograniczenia Free na Render

- usluga moze usypiac sie po bezczynnosci (pierwsze zapytanie po przerwie jest wolniejsze),
- to nadal jest lepsze od chwilowego tunelu, bo URL jest staly.
