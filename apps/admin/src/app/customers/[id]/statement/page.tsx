import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
  searchParams: { from?: string; to?: string };
}

interface Movement {
  date: Date;
  type: 'FAC' | 'REC';
  number: string;
  debit: number;
  credit: number;
  linkId: string;
}

export default async function CustomerStatementPage({ params, searchParams }: Props) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      invoices: {
        orderBy: { date: 'asc' },
      },
      payments: {
        orderBy: { date: 'asc' },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  // Parse date filters
  const fromDate = searchParams.from ? new Date(searchParams.from) : null;
  const toDate = searchParams.to ? new Date(searchParams.to + 'T23:59:59') : null;

  // Build movements list
  const movements: Movement[] = [];

  for (const invoice of customer.invoices) {
    const date = new Date(invoice.date);
    if (fromDate && date < fromDate) continue;
    if (toDate && date > toDate) continue;

    movements.push({
      date,
      type: 'FAC',
      number: invoice.number,
      debit: Number(invoice.total),
      credit: 0,
      linkId: invoice.id,
    });
  }

  for (const payment of customer.payments) {
    const date = new Date(payment.date);
    if (fromDate && date < fromDate) continue;
    if (toDate && date > toDate) continue;

    movements.push({
      date,
      type: 'REC',
      number: payment.receiptNumber,
      debit: 0,
      credit: Number(payment.amount),
      linkId: payment.id,
    });
  }

  // Sort by date
  movements.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate running balance
  let runningBalance = 0;
  const movementsWithBalance = movements.map((m) => {
    runningBalance += m.debit - m.credit;
    return { ...m, balance: runningBalance };
  });

  // Calculate totals
  const totalDebit = movements.reduce((sum, m) => sum + m.debit, 0);
  const totalCredit = movements.reduce((sum, m) => sum + m.credit, 0);
  const finalBalance = totalDebit - totalCredit;

  // Default dates for form
  const defaultFrom = fromDate
    ? fromDate.toISOString().split('T')[0]
    : '';
  const defaultTo = toDate
    ? toDate.toISOString().split('T')[0]
    : '';

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/customers/${customer.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a {customer.businessName}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Estado de cuenta</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Cliente:</span>{' '}
                <span className="font-medium text-slate-700">{customer.businessName}</span>
              </div>
              <div>
                <span className="text-slate-500">Código:</span>{' '}
                <span className="font-mono font-medium text-slate-700">{customer.code}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Saldo actual</div>
            <div className={`text-2xl font-semibold ${finalBalance > 0 ? 'text-red-600' : finalBalance < 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
              {formatCurrency(finalBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Filtros
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              name="from"
              defaultValue={defaultFrom}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              name="to"
              defaultValue={defaultTo}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrar
          </button>
          {(fromDate || toDate) && (
            <Link
              href={`/customers/${customer.id}/statement`}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total facturado</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(totalDebit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total cobrado</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{formatCurrency(totalCredit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Saldo</div>
          <div className={`mt-1 text-2xl font-semibold ${finalBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(finalBalance)}
          </div>
        </div>
      </div>

      {/* Movements table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Movimientos ({movementsWithBalance.length})
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Debe
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Haber
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Saldo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movementsWithBalance.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin movimientos en el período
                </td>
              </tr>
            ) : (
              movementsWithBalance.map((movement, index) => (
                <tr key={`${movement.type}-${movement.number}-${index}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(movement.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      movement.type === 'FAC'
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                        : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                    }`}>
                      {movement.type === 'FAC' ? 'Factura' : 'Recibo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={movement.type === 'FAC' ? `/invoices/${movement.linkId}` : `/payments/${movement.linkId}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {movement.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {movement.debit > 0 ? (
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(movement.debit)}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {movement.credit > 0 ? (
                      <span className="text-sm font-medium text-emerald-600">{formatCurrency(movement.credit)}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${movement.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatCurrency(movement.balance)}
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
