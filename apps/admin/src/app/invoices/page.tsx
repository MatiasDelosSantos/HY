import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { date: 'desc' },
    include: { customer: true },
  });

  const pending = invoices.filter((i) => i.status === 'PENDING').length;
  const partial = invoices.filter((i) => i.status === 'PARTIAL').length;
  const paid = invoices.filter((i) => i.status === 'PAID').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Facturas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Historial de facturas y estado de cobranza
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{invoices.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Pendientes</div>
          <div className="mt-1 text-2xl font-semibold text-slate-600">{pending}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Parciales</div>
          <div className="mt-1 text-2xl font-semibold text-amber-600">{partial}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Pagadas</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{paid}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                    <p className="text-sm">No hay facturas registradas</p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => {
                const balance = Number(invoice.balance);
                const hasBalance = balance > 0;

                return (
                  <tr
                    key={invoice.id}
                    className="hover:bg-slate-50 transition-colors cursor-default"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {invoice.customer.businessName}
                      </div>
                      <div className="text-sm text-slate-500">
                        {invoice.customer.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {formatDate(invoice.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(Number(invoice.total))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${hasBalance ? 'text-red-600' : 'text-slate-400'}`}>
                        {formatCurrency(balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Pendiente',
      className: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20',
    },
    PARTIAL: {
      label: 'Parcial',
      className: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    },
    PAID: {
      label: 'Pagada',
      className: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    },
  };

  const { label, className } = config[status] ?? config.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </span>
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
  }).format(new Date(date));
}
