import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

interface Props {
  searchParams: { q?: string };
}

export default async function SuppliersPage({ searchParams }: Props) {
  const query = searchParams.q?.trim().toLowerCase();

  const allSuppliers = await prisma.supplier.findMany({
    orderBy: { code: 'asc' },
    include: {
      _count: {
        select: { purchaseInvoices: true },
      },
    },
  });

  const suppliers = query
    ? allSuppliers.filter(
        (s) =>
          s.code.toLowerCase().includes(query) ||
          s.businessName.toLowerCase().includes(query) ||
          (s.taxId && s.taxId.toLowerCase().includes(query)) ||
          s.email.toLowerCase().includes(query)
      )
    : allSuppliers;

  const activeCount = allSuppliers.filter((s) => s.isActive).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Proveedores</h1>
          <p className="mt-1 text-sm text-slate-500">
            Listado de proveedores registrados en el sistema
          </p>
        </div>
        <Link
          href="/suppliers/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo proveedor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{allSuppliers.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Activos</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Inactivos</div>
          <div className="mt-1 text-2xl font-semibold text-slate-400">
            {allSuppliers.length - activeCount}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar placeholder="Buscar por codigo, razon social, CUIT o email..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Codigo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Razon Social
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                CUIT
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Facturas
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-sm">
                      {query ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-slate-50 transition-colors cursor-default"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/suppliers/${supplier.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {supplier.code}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{supplier.businessName}</div>
                    {supplier.address && (
                      <div className="text-sm text-slate-500 truncate max-w-xs">{supplier.address}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-mono">
                      {supplier.taxId ?? <span className="text-slate-300">-</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{supplier.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{supplier._count.purchaseInvoices}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                        supplier.isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-600/20'
                      }`}
                    >
                      {supplier.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {query && suppliers.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            Mostrando {suppliers.length} de {allSuppliers.length} proveedores
          </div>
        )}
      </div>
    </div>
  );
}
