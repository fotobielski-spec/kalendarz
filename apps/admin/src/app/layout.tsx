import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dokumenty ID — Admin',
  description: 'Panel administracyjny',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}
