const DEFAULT_API_BASE = '/api/v1';

export function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE;
}

export function apiUrl(path: string): string {
  return `${apiBaseUrl()}${path}`;
}
