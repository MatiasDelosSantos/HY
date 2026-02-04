import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PaymentForm } from './PaymentForm';

interface Props {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: Props) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
      paymentAllocations: {
        include: { payment: true },
        orderBy: { payment: { date: 'asc' } },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const balance = Number(invoice.balance);
  const hasBalance = balance > 0;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Facturas
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Factura {invoice.type === 'SALE' ? 'Venta' : invoice.type} - {invoice.number}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Detalle del comprobante
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}/print`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </Link>
          <StatusBadge status={invoice.status} />
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
              <div className="font-medium text-slate-900">{invoice.customer.businessName}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Código</div>
                <div className="font-mono text-sm text-slate-700">{invoice.customer.code}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">CUIT</div>
                <div className="font-mono text-sm text-slate-700">
                  {invoice.customer.taxId ?? <span className="text-slate-300">—</span>}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500">Condición IVA</div>
              <div className="text-sm text-slate-700">
                {formatTaxStatus(invoice.customer.taxStatus)}
              </div>
            </div>
          </div>
        </div>

        {/* Fechas y totales */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Comprobante
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-500">Fecha emisión</div>
                <div className="text-slate-900">{formatDate(invoice.date)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Fecha vencimiento</div>
                <div className="text-slate-900">
                  {invoice.dueDate ? formatDate(invoice.dueDate) : <span className="text-slate-300">—</span>}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-700">{formatCurrency(Number(invoice.subtotal))}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">Descuento</span>
                <span className="text-slate-700">-{formatCurrency(Number(invoice.discount))}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">IVA 21%</span>
                <span className="text-slate-700">{formatCurrency(Number(invoice.tax21))}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-slate-200">
                <span className="text-slate-900">Total</span>
                <span className="text-slate-900">{formatCurrency(Number(invoice.total))}</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span className="text-slate-900">Saldo</span>
                <span className={hasBalance ? 'text-red-600' : 'text-emerald-600'}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Detalle de ítems
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio Unit.
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Descuento
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin ítems
                </td>
              </tr>
            ) : (
              invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {item.product.code}
                      </span>
                      <span className="text-slate-900">{item.product.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{Number(item.quantity)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-700">{formatCurrency(Number(item.unitPrice))}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-slate-500">
                      {Number(item.discount) > 0 ? `-${formatCurrency(Number(item.discount))}` : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(Number(item.total))}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagos aplicados */}
      {invoice.paymentAllocations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Pagos aplicados
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
                  Monto aplicado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.paymentAllocations.map((alloc) => (
                <tr key={alloc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {formatDate(alloc.payment.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/payments/${alloc.payment.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {alloc.payment.receiptNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-emerald-600">
                      {formatCurrency(Number(alloc.amount))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={2} className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-700">Total aplicado</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(
                      invoice.paymentAllocations.reduce((sum, a) => sum + Number(a.amount), 0)
                    )}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Registrar pago */}
      <div className="mt-6">
        <PaymentForm invoiceId={invoice.id} balance={balance} />
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
    <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${className}`}>
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
