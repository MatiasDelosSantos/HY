'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/customers', label: 'Clientes', icon: 'users' },
  { href: '/products', label: 'Productos', icon: 'box' },
  { href: '/products/stock', label: 'Stock', icon: 'package' },
  { href: '/invoices', label: 'Facturas', icon: 'file-text' },
  { href: '/payments', label: 'Pagos', icon: 'credit-card' },
];

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    box: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    package: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'file-text': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    'credit-card': (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 10h22" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-semibold tracking-tight">HY Admin</h1>
        <p className="text-slate-500 text-xs mt-0.5">Herrajes H. Yrigoyen 825</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Módulos
          </span>
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/products/stock' && pathname.includes('/stock'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">
          Sistema de gestión
        </div>
      </div>
    </aside>
  );
}
