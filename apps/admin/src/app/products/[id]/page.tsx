import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      pricing: true,
      invoiceItems: {
        include: {
          invoice: {
            include: {
              customer: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) {
    notFound();
  }

  const pricing = product.pricing;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Productos
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{product.description}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Código:</span>{' '}
                <span className="font-mono font-medium text-slate-700">{product.code}</span>
              </div>
              {product.brand && (
                <div>
                  <span className="text-slate-500">Marca:</span>{' '}
                  <span className="text-slate-700">{product.brand}</span>
                </div>
              )}
              {product.manufacturerCode && (
                <div>
                  <span className="text-slate-500">Cód. fábrica:</span>{' '}
                  <span className="font-mono text-slate-700">{product.manufacturerCode}</span>
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </Link>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Precios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-sm font-medium text-slate-500">Precio costo</div>
            <div className="mt-1 text-xl font-semibold text-slate-900">
              {pricing ? formatCurrency(Number(pricing.costPrice)) : '—'}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-600">Precio público</div>
            <div className="mt-1 text-xl font-semibold text-blue-700">
              {pricing ? formatCurrency(Number(pricing.publicPrice)) : '—'}
            </div>
            {pricing && Number(pricing.publicMarkup) > 0 && (
              <div className="text-xs text-blue-500 mt-1">+{Number(pricing.publicMarkup)}%</div>
            )}
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-sm font-medium text-emerald-600">Precio gremio</div>
            <div className="mt-1 text-xl font-semibold text-emerald-700">
              {pricing ? formatCurrency(Number(pricing.tradePrice)) : '—'}
            </div>
            {pricing && Number(pricing.tradeMarkup) > 0 && (
              <div className="text-xs text-emerald-500 mt-1">+{Number(pricing.tradeMarkup)}%</div>
            )}
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-purple-600">Precio mayorista</div>
            <div className="mt-1 text-xl font-semibold text-purple-700">
              {pricing ? formatCurrency(Number(pricing.wholesalePrice)) : '—'}
            </div>
            {pricing && Number(pricing.wholesaleMarkup) > 0 && (
              <div className="text-xs text-purple-500 mt-1">+{Number(pricing.wholesaleMarkup)}%</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Últimas ventas
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Factura
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio unit.
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {product.invoiceItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin ventas registradas
                </td>
              </tr>
            ) : (
              product.invoiceItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/invoices/${item.invoice.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {item.invoice.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(item.invoice.date)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/customers/${item.invoice.customer.id}`}
                      className="text-sm text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {item.invoice.customer.businessName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-slate-600">{Number(item.quantity)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-slate-600">{formatCurrency(Number(item.unitPrice))}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(Number(item.total))}</span>
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
