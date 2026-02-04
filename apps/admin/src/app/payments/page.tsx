import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { date: 'desc' },
    include: {
      customer: true,
      allocations: {
        include: {
          invoice: true,
        },
      },
    },
  });

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const withCredit = payments.filter((p) => {
    const applied = p.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
    return Number(p.amount) - applied > 0;
  }).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Pagos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Historial de cobranzas e imputaciones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total pagos</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{payments.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total cobrado</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {formatCurrency(totalCollected)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Con saldo a favor</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">{withCredit}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nº Recibo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Aplicado
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                A favor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth={1} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M1 10h22" />
                    </svg>
                    <p className="text-sm">No hay pagos registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => {
                const amount = Number(payment.amount);
                const applied = payment.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
                const credit = amount - applied;

                return (
                  <tr
                    key={payment.id}
                    className="hover:bg-slate-50 transition-colors cursor-default"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/payments/${payment.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {payment.receiptNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {payment.customer.businessName}
                      </div>
                      <div className="text-sm text-slate-500">
                        {payment.customer.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {formatDate(payment.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {formatCurrency(applied)}
                      </div>
                      {payment.allocations.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {payment.allocations.map((alloc) => (
                            <div key={alloc.id} className="text-xs text-slate-500">
                              <span className="font-mono">{alloc.invoice.number}</span>
                              <span className="mx-1">→</span>
                              <span>{formatCurrency(Number(alloc.amount))}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${credit > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {formatCurrency(credit)}
                      </span>
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
