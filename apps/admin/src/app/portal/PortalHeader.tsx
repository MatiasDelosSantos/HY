'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logoutSupplier } from './login/actions';

export function PortalHeader() {
  const pathname = usePathname();
  const isLoginPage = pathname === '/portal/login';

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Portal Proveedores</h1>
            <p className="text-xs text-slate-500">Herrajes H. Yrigoyen 825 S.A.</p>
          </div>

          {!isLoginPage && (
            <nav className="flex items-center gap-4">
              <Link
                href="/portal/upload"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/portal/upload'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cargar Factura
              </Link>
              <Link
                href="/portal/invoices"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/portal/invoices'
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mis Facturas
              </Link>
              <form action={logoutSupplier}>
                <button
                  type="submit"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Salir
                </button>
              </form>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
