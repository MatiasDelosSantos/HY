import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'HY Admin',
  description: 'Panel de administración - Herrajes H. Yrigoyen',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <div className="flex min-h-screen bg-slate-100">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
