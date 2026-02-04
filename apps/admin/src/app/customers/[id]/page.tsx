import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function CustomerDetailPage({ params }: Props) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: {
      invoices: {
        orderBy: { date: 'desc' },
      },
      payments: {
        orderBy: { date: 'desc' },
        include: {
          allocations: true,
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalInvoiced = customer.invoices.reduce((sum, i) => sum + Number(i.total), 0);
  const totalCollected = customer.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const customerBalance = customer.invoices.reduce((sum, i) => sum + Number(i.balance), 0);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/customers"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Clientes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{customer.businessName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Código:</span>{' '}
                <span className="font-mono font-medium text-slate-700">{customer.code}</span>
              </div>
              <div>
                <span className="text-slate-500">CUIT:</span>{' '}
                <span className="font-mono text-slate-700">{customer.taxId ?? '—'}</span>
              </div>
              <div>
                <span className="text-slate-500">Cond. IVA:</span>{' '}
                <span className="text-slate-700">{formatTaxStatus(customer.taxStatus)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
              customer.priceList === 'PUBLICO'
                ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                : customer.priceList === 'GREMIO'
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
              : 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
            }`}>
              Lista {customer.priceList}
            </span>
            <Link
              href={`/invoices/new?customerId=${customer.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva factura
            </Link>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total facturado</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(totalInvoiced)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total cobrado</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{formatCurrency(totalCollected)}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Saldo cliente</div>
          <div className={`mt-1 text-2xl font-semibold ${customerBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(customerBalance)}
          </div>
        </div>
      </div>

      {/* Facturas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Facturas ({customer.invoices.length})
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Número
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
            {customer.invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin facturas
                </td>
              </tr>
            ) : (
              customer.invoices.map((invoice) => {
                const balance = Number(invoice.balance);
                return (
                  <tr key={invoice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {invoice.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{formatDate(invoice.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(Number(invoice.total))}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-medium ${balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
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

      {/* Pagos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Pagos ({customer.payments.length})
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Nº Recibo
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                A favor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customer.payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin pagos
                </td>
              </tr>
            ) : (
              customer.payments.map((payment) => {
                const amount = Number(payment.amount);
                const applied = payment.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
                const credit = amount - applied;
                return (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{formatDate(payment.date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/payments/${payment.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {payment.receiptNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(amount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {credit > 0 ? (
                        <span className="text-sm font-medium text-emerald-600">{formatCurrency(credit)}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
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

function formatTaxStatus(status: string | null): string {
  if (!status) return '—';
  const map: Record<string, string> = {
    RESPONSABLE_INSCRIPTO: 'Responsable Inscripto',
    RESPONSABLE_NO_INSCRIPTO: 'Responsable No Inscripto',
    MONOTRIBUTO: 'Monotributo',
    CONSUMIDOR_FINAL: 'Consumidor Final',
    EXENTO: 'Exento',
  };
  return map[status] ?? status;
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
