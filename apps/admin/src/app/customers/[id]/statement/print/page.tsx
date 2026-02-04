import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PrintLayout } from '@/components/print/PrintLayout';
import { PrintHeader } from '@/components/print/PrintHeader';

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
}

export default async function CustomerStatementPrintPage({ params, searchParams }: Props) {
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

  // Format period string
  const periodStr = fromDate || toDate
    ? `${fromDate ? formatDate(fromDate) : 'Inicio'} - ${toDate ? formatDate(toDate) : 'Actual'}`
    : 'Todos los movimientos';

  return (
    <PrintLayout title={`Estado de cuenta - ${customer.businessName}`}>
      <div className="max-w-4xl mx-auto p-8">
        <PrintHeader />

        {/* Statement header */}
        <div className="border-2 border-slate-800 mb-6">
          <div className="bg-slate-100 px-4 py-3 border-b-2 border-slate-800">
            <h2 className="text-xl font-bold">ESTADO DE CUENTA</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Cliente</p>
                <p className="text-lg font-bold">{customer.businessName}</p>
                <p className="text-sm text-slate-500 font-mono">Código: {customer.code}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Período</p>
                <p className="font-medium">{periodStr}</p>
              </div>
            </div>
            {customer.taxId && (
              <div className="mt-2 pt-2 border-t border-slate-300">
                <p className="text-sm">
                  <span className="text-slate-600">CUIT:</span>{' '}
                  <span className="font-mono">{customer.taxId}</span>
                  {customer.address && (
                    <>
                      <span className="mx-2 text-slate-400">•</span>
                      <span className="text-slate-600">Dirección:</span> {customer.address}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border-2 border-slate-800 p-3 text-center">
            <p className="text-sm text-slate-600">Total Facturado</p>
            <p className="text-lg font-bold">{formatCurrency(totalDebit)}</p>
          </div>
          <div className="border-2 border-slate-800 p-3 text-center">
            <p className="text-sm text-slate-600">Total Cobrado</p>
            <p className="text-lg font-bold text-emerald-700">{formatCurrency(totalCredit)}</p>
          </div>
          <div className="border-2 border-slate-800 p-3 text-center bg-slate-800 text-white">
            <p className="text-sm">Saldo Actual</p>
            <p className="text-lg font-bold">{formatCurrency(finalBalance)}</p>
          </div>
        </div>

        {/* Movements table */}
        <table className="w-full border-2 border-slate-800">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-800">
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Fecha</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Tipo</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Número</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Debe</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Haber</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {movementsWithBalance.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Sin movimientos en el período
                </td>
              </tr>
            ) : (
              movementsWithBalance.map((movement, index) => (
                <tr
                  key={`${movement.type}-${movement.number}-${index}`}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                >
                  <td className="px-3 py-2 text-sm">{formatDate(movement.date)}</td>
                  <td className="px-3 py-2 text-sm">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                        movement.type === 'FAC'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {movement.type === 'FAC' ? 'Factura' : 'Recibo'}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-sm">{movement.number}</td>
                  <td className="px-3 py-2 text-right text-sm">
                    {movement.debit > 0 ? formatCurrency(movement.debit) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-emerald-700">
                    {movement.credit > 0 ? formatCurrency(movement.credit) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-medium">
                    {formatCurrency(movement.balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-800 bg-slate-100 font-bold">
              <td colSpan={3} className="px-3 py-2 text-right text-sm uppercase">
                Totales
              </td>
              <td className="px-3 py-2 text-right text-sm">{formatCurrency(totalDebit)}</td>
              <td className="px-3 py-2 text-right text-sm text-emerald-700">
                {formatCurrency(totalCredit)}
              </td>
              <td className="px-3 py-2 text-right text-sm">{formatCurrency(finalBalance)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-sm text-slate-500">
          <p>Estado de cuenta generado el {formatDate(new Date())}</p>
        </div>
      </div>
    </PrintLayout>
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
