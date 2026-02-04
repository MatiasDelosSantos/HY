import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PrintLayout } from '@/components/print/PrintLayout';
import { PrintHeader } from '@/components/print/PrintHeader';
import { pesosEnLetras } from '@/lib/numberToWords';

interface Props {
  params: { id: string };
}

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
  CHECK: 'Cheque',
};

export default async function PaymentPrintPage({ params }: Props) {
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

  const amountInWords = pesosEnLetras(Number(payment.amount));

  return (
    <PrintLayout title={`Recibo ${payment.receiptNumber}`}>
      <div className="max-w-4xl mx-auto p-8">
        <PrintHeader showDate={false} />

        {/* Receipt header */}
        <div className="border-2 border-slate-800 mb-6">
          <div className="flex">
            <div className="flex-1 p-4 border-r-2 border-slate-800">
              <h2 className="text-2xl font-bold">RECIBO</h2>
              <p className="text-sm text-slate-600 mt-1">Comprobante de pago</p>
            </div>
            <div className="flex-1 p-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Nº</p>
                <p className="text-2xl font-bold font-mono">{payment.receiptNumber}</p>
                <p className="text-sm text-slate-600 mt-2">Fecha</p>
                <p className="font-medium">{formatDate(payment.date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and amount */}
        <div className="border-2 border-slate-800 p-4 mb-6">
          <div className="mb-4">
            <p className="text-sm text-slate-600">Recibí de</p>
            <p className="text-xl font-bold">{payment.customer.businessName}</p>
            <p className="text-sm text-slate-500 font-mono">
              Código: {payment.customer.code}
              {payment.customer.taxId && ` • CUIT: ${payment.customer.taxId}`}
            </p>
          </div>

          <div className="border-t-2 border-slate-800 pt-4 mt-4">
            <p className="text-sm text-slate-600">La suma de</p>
            <p className="text-lg font-medium uppercase">{amountInWords}</p>
          </div>

          <div className="border-t border-slate-300 pt-4 mt-4">
            <p className="text-sm text-slate-600">En concepto de</p>
            <p className="font-medium">
              {payment.allocations.length > 0
                ? `Pago de factura${payment.allocations.length > 1 ? 's' : ''}`
                : 'Pago a cuenta'}
            </p>
          </div>
        </div>

        {/* Payment methods */}
        {payment.methodLines.length > 0 && (
          <div className="border-2 border-slate-800 mb-6">
            <div className="bg-slate-100 px-4 py-2 border-b-2 border-slate-800">
              <h3 className="font-bold text-sm uppercase">Forma de pago</h3>
            </div>
            <div className="p-4">
              <table className="w-full">
                <tbody>
                  {payment.methodLines.map((ml) => (
                    <tr key={ml.id}>
                      <td className="py-1">
                        <span className="font-medium">{METHOD_LABELS[ml.method] ?? ml.method}</span>
                      </td>
                      <td className="py-1 text-right font-mono">
                        {formatCurrency(Number(ml.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices paid */}
        {payment.allocations.length > 0 && (
          <div className="border-2 border-slate-800 mb-6">
            <div className="bg-slate-100 px-4 py-2 border-b-2 border-slate-800">
              <h3 className="font-bold text-sm uppercase">Facturas canceladas</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300">
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase">Nº Factura</th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase">Fecha</th>
                  <th className="px-4 py-2 text-right text-xs font-bold uppercase">Total Fact.</th>
                  <th className="px-4 py-2 text-right text-xs font-bold uppercase">Aplicado</th>
                </tr>
              </thead>
              <tbody>
                {payment.allocations.map((alloc) => (
                  <tr key={alloc.id} className="border-b border-slate-200">
                    <td className="px-4 py-2 font-mono text-sm">{alloc.invoice.number}</td>
                    <td className="px-4 py-2 text-sm">{formatDate(alloc.invoice.date)}</td>
                    <td className="px-4 py-2 text-right text-sm">
                      {formatCurrency(Number(alloc.invoice.total))}
                    </td>
                    <td className="px-4 py-2 text-right text-sm font-medium">
                      {formatCurrency(Number(alloc.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-end">
          <div className="w-64 border-2 border-slate-800">
            <div className="flex justify-between px-4 py-3 bg-slate-800 text-white">
              <span className="font-bold">TOTAL</span>
              <span className="font-bold font-mono">{formatCurrency(Number(payment.amount))}</span>
            </div>
          </div>
        </div>

        {/* Signature area */}
        <div className="mt-16 flex justify-between items-end">
          <div className="text-center">
            <div className="w-48 border-t-2 border-slate-800 pt-2">
              <p className="text-sm text-slate-600">Firma del cliente</p>
            </div>
          </div>
          <div className="text-center">
            <div className="w-48 border-t-2 border-slate-800 pt-2">
              <p className="text-sm text-slate-600">Firma y sello</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-sm text-slate-500">
          <p>Documento no válido como factura fiscal</p>
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
