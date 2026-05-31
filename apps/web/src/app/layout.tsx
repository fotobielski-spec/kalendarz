import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dokumenty ID Web',
  description: 'Zdjęcia biometryczne do dokumentów — szybko i zgodnie z wymaganiami',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
