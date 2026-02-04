import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { code: 'asc' },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Listado de clientes registrados en el sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{customers.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Lista Público</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {customers.filter(c => c.priceList === 'PUBLICO').length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Lista Gremio/Mayorista</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {customers.filter(c => c.priceList !== 'PUBLICO').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Razón Social
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                CUIT
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Lista
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cond. IVA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    </svg>
                    <p className="text-sm">No hay clientes registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50 transition-colors cursor-default"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {customer.code}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{customer.businessName}</div>
                    {customer.address && (
                      <div className="text-sm text-slate-500 truncate max-w-xs">{customer.address}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 font-mono">
                      {customer.taxId ?? <span className="text-slate-300">—</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      customer.priceList === 'PUBLICO'
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                        : customer.priceList === 'GREMIO'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                        : 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
                    }`}>
                      {customer.priceList}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {formatTaxStatus(customer.taxStatus)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatTaxStatus(status: string | null): string {
  if (!status) return '—';
  const map: Record<string, string> = {
    RESPONSABLE_INSCRIPTO: 'Resp. Inscripto',
    RESPONSABLE_NO_INSCRIPTO: 'Resp. No Inscripto',
    MONOTRIBUTO: 'Monotributo',
    CONSUMIDOR_FINAL: 'Cons. Final',
    EXENTO: 'Exento',
  };
  return map[status] ?? status;
}
