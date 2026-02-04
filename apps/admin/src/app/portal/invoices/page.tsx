import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSupplierFromSession } from '@/lib/auth/session';
import { StatusBadge } from '@/components/StatusBadge';

export default async function PortalInvoicesPage() {
  const supplier = await getSupplierFromSession();

  if (!supplier) {
    redirect('/portal/login');
  }

  const invoices = await prisma.purchaseInvoice.findMany({
    where: { supplierId: supplier.id },
    orderBy: { createdAt: 'desc' },
  });

  const pendingCount = invoices.filter(
    (i) => i.status === 'PENDING_REVIEW' || i.status === 'IN_REVIEW'
  ).length;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Mis Facturas</h2>
          <p className="mt-1 text-sm text-slate-500">
            Historial de facturas subidas al sistema
          </p>
        </div>
        <Link
          href="/portal/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva factura
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">En revision</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">{pendingCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Aprobadas</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {invoices.filter((i) => i.status === 'APPROVED' || i.status === 'PAID').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha carga
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Archivo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No has subido ninguna factura todavia</p>
                    <Link
                      href="/portal/upload"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Subir primera factura
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {formatDate(invoice.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <span className="text-sm text-slate-700 truncate max-w-[200px]">
                        {invoice.originalFileName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-slate-600">
                      {invoice.number ?? '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {Number(invoice.total) > 0 ? formatCurrency(Number(invoice.total)) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                    {invoice.status === 'REJECTED' && invoice.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1 max-w-[200px] truncate">
                        {invoice.rejectionReason}
                      </p>
                    )}
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
