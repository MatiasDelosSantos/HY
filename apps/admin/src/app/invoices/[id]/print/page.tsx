import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PrintLayout } from '@/components/print/PrintLayout';
import { PrintHeader } from '@/components/print/PrintHeader';

interface Props {
  params: { id: string };
}

export default async function InvoicePrintPage({ params }: Props) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: { product: true },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const invoiceType = invoice.letterType || 'B';

  return (
    <PrintLayout title={`Factura ${invoice.number}`}>
      <div className="max-w-4xl mx-auto p-8">
        <PrintHeader showDate={false} />

        {/* Invoice header */}
        <div className="border-2 border-slate-800 mb-6">
          <div className="flex">
            {/* Left side - Invoice type */}
            <div className="flex-1 p-4 border-r-2 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">FACTURA</h2>
                  <p className="text-sm text-slate-600">
                    {invoice.type === 'SALE' ? 'Original' : 'Duplicado'}
                  </p>
                </div>
                <div className="text-center border-2 border-slate-800 px-4 py-2">
                  <span className="text-3xl font-bold">{invoiceType}</span>
                </div>
              </div>
            </div>
            {/* Right side - Invoice number and date */}
            <div className="flex-1 p-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Nº Comprobante</p>
                <p className="text-xl font-bold font-mono">{invoice.number}</p>
                <p className="text-sm text-slate-600 mt-2">Fecha de emisión</p>
                <p className="font-medium">{formatDate(invoice.date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer info */}
        <div className="border-2 border-slate-800 p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Cliente</p>
              <p className="font-bold text-lg">{invoice.customer.businessName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Código</p>
              <p className="font-mono font-medium">{invoice.customer.code}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-300">
            <div>
              <p className="text-sm text-slate-600">CUIT</p>
              <p className="font-mono">{invoice.customer.taxId || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Condición IVA</p>
              <p>{formatTaxStatus(invoice.customer.taxStatus)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Dirección</p>
              <p>{invoice.customer.address || '—'}</p>
            </div>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full border-2 border-slate-800 mb-6">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-800">
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Código</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Descripción</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Cant.</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">P. Unit.</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Desc.</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-3 py-2 font-mono text-sm">{item.product.code}</td>
                <td className="px-3 py-2 text-sm">{item.product.description}</td>
                <td className="px-3 py-2 text-right text-sm">{Number(item.quantity)}</td>
                <td className="px-3 py-2 text-right text-sm">{formatCurrency(Number(item.unitPrice))}</td>
                <td className="px-3 py-2 text-right text-sm">
                  {Number(item.discount) > 0 ? formatCurrency(Number(item.discount)) : '—'}
                </td>
                <td className="px-3 py-2 text-right text-sm font-medium">
                  {formatCurrency(Number(item.total))}
                </td>
              </tr>
            ))}
            {/* Empty rows to fill space */}
            {invoice.items.length < 10 &&
              Array.from({ length: 10 - invoice.items.length }).map((_, i) => (
                <tr key={`empty-${i}`} className={((invoice.items.length + i) % 2 === 0) ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-3 py-2">&nbsp;</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 border-2 border-slate-800">
            <div className="flex justify-between px-4 py-2 border-b border-slate-300">
              <span className="text-sm">Subtotal</span>
              <span className="font-mono">{formatCurrency(Number(invoice.subtotal))}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between px-4 py-2 border-b border-slate-300">
                <span className="text-sm">Descuento</span>
                <span className="font-mono">-{formatCurrency(Number(invoice.discount))}</span>
              </div>
            )}
            {Number(invoice.tax21) > 0 && (
              <div className="flex justify-between px-4 py-2 border-b border-slate-300">
                <span className="text-sm">IVA 21%</span>
                <span className="font-mono">{formatCurrency(Number(invoice.tax21))}</span>
              </div>
            )}
            {Number(invoice.tax105) > 0 && (
              <div className="flex justify-between px-4 py-2 border-b border-slate-300">
                <span className="text-sm">IVA 10.5%</span>
                <span className="font-mono">{formatCurrency(Number(invoice.tax105))}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 bg-slate-800 text-white">
              <span className="font-bold">TOTAL</span>
              <span className="font-bold font-mono">{formatCurrency(Number(invoice.total))}</span>
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
