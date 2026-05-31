/** Kody błędów API — mapowane na komunikaty PL w apps/web (etap 2+) */
export const ApiErrorCode = {
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UPLOAD_TOO_LARGE: 'UPLOAD_TOO_LARGE',
  UPLOAD_INVALID_TYPE: 'UPLOAD_INVALID_TYPE',
  ANALYSIS_IN_PROGRESS: 'ANALYSIS_IN_PROGRESS',
  ANALYSIS_FAILED: 'ANALYSIS_FAILED',
  ENGINE_UNAVAILABLE: 'ENGINE_UNAVAILABLE',
  GENERATION_FAILED: 'GENERATION_FAILED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];

/** Placeholder mapy PL — uzupełniana w etapie 2 */
export const API_ERROR_MESSAGES_PL: Record<ApiErrorCode, string> = {
  SESSION_NOT_FOUND: 'Sesja nie została znaleziona. Zeskanuj kod QR ponownie.',
  SESSION_EXPIRED: 'Sesja wygasła. Odśwież stronę i rozpocznij zamówienie od nowa.',
  UPLOAD_TOO_LARGE: 'Plik jest zbyt duży. Wybierz mniejsze zdjęcie.',
  UPLOAD_INVALID_TYPE: 'Nieobsługiwany format pliku. Użyj JPEG lub PNG.',
  ANALYSIS_IN_PROGRESS: 'Trwa analiza zdjęcia. Proszę czekać.',
  ANALYSIS_FAILED: 'Analiza nie powiodła się. Spróbuj ponownie.',
  ENGINE_UNAVAILABLE: 'Usługa analizy jest chwilowo niedostępna.',
  GENERATION_FAILED: 'Nie udało się wygenerować zdjęć. Skontaktuj się z obsługą.',
  PAYMENT_FAILED: 'Płatność nie powiodła się.',
  UNAUTHORIZED: 'Brak autoryzacji.',
  FORBIDDEN: 'Brak uprawnień.',
  RATE_LIMITED: 'Zbyt wiele prób. Spróbuj za chwilę.',
  INTERNAL_ERROR: 'Wystąpił błąd serwera. Spróbuj ponownie.',
};
