import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
  CHECK: 'Cheque',
};

export default async function PaymentDetailPage({ params }: Props) {
  const payment = await prisma.payment.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      methodLines: {
        orderBy: { createdAt: 'asc' },
      },
      allocations: {
        include: { invoice: true },
        orderBy: { invoice: { date: 'asc' } },
      },
    },
  });

  if (!payment) {
    notFound();
  }

  const totalApplied = payment.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
  const credit = Number(payment.amount) - totalApplied;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/payments"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Pagos
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Recibo {payment.receiptNumber}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(payment.date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {payment.methodLines.length > 0 ? (
            payment.methodLines.map((ml) => (
              <span
                key={ml.id}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
                  ml.method === 'CASH'
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    : ml.method === 'TRANSFER'
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                    : ml.method === 'CHECK'
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                    : 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
                }`}
              >
                {METHOD_LABELS[ml.method] ?? ml.method}: {formatCurrency(Number(ml.amount))}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-600/20">
              Sin método especificado
            </span>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cliente */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Cliente
          </h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-500">Razón Social</div>
              <Link
                href={`/customers/${payment.customer.id}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {payment.customer.businessName}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Código</div>
                <div className="font-mono text-sm text-slate-700">{payment.customer.code}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">CUIT</div>
                <div className="font-mono text-sm text-slate-700">
                  {payment.customer.taxId ?? <span className="text-slate-300">—</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Resumen
          </h2>
          <div className="space-y-3">
            {/* Desglose por método */}
            {payment.methodLines.length > 0 && (
              <div className="space-y-1.5 pb-3 border-b border-slate-200">
                {payment.methodLines.map((ml) => (
                  <div key={ml.id} className="flex justify-between">
                    <span className="text-sm text-slate-500">{METHOD_LABELS[ml.method] ?? ml.method}</span>
                    <span className="text-sm text-slate-700">{formatCurrency(Number(ml.amount))}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Total cobrado</span>
              <span className="text-sm font-semibold text-slate-900">{formatCurrency(Number(payment.amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Total aplicado</span>
              <span className="text-sm font-medium text-emerald-600">{formatCurrency(totalApplied)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-700">Saldo a favor</span>
              <span className={`text-sm font-semibold ${credit > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                {formatCurrency(credit)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Facturas imputadas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Facturas imputadas ({payment.allocations.length})
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nº Factura
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total Factura
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Monto Aplicado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payment.allocations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin imputaciones
                </td>
              </tr>
            ) : (
              payment.allocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/invoices/${alloc.invoice.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {alloc.invoice.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(alloc.invoice.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-slate-600">{formatCurrency(Number(alloc.invoice.total))}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-emerald-600">
                      {formatCurrency(Number(alloc.amount))}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {payment.allocations.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-700">Total aplicado</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(totalApplied)}
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
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
