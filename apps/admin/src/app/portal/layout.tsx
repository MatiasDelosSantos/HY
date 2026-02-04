import type { Metadata } from 'next';
import { PortalHeader } from './PortalHeader';

export const metadata: Metadata = {
  title: 'Portal Proveedores - HY',
  description: 'Portal de proveedores - Herrajes H. Yrigoyen',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <PortalHeader />

      {/* Main */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-xs text-slate-500 text-center">
            Sistema de gestion de facturas de compra
          </p>
        </div>
      </footer>
    </div>
  );
}
