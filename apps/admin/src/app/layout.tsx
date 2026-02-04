import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HY Admin',
  description: 'Panel de administracion - Herrajes H. Yrigoyen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
