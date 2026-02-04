import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function StockHistoryPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      stockMovements: {
        include: {
          invoice: {
            select: { id: true, number: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const movements = product.stockMovements;

  function getTypeLabel(type: string) {
    switch (type) {
      case 'ENTRY':
        return 'Ingreso';
      case 'EXIT':
        return 'Egreso';
      case 'ADJUSTMENT':
        return 'Ajuste';
      default:
        return type;
    }
  }

  function getTypeColor(type: string) {
    switch (type) {
      case 'ENTRY':
        return 'bg-emerald-100 text-emerald-700';
      case 'EXIT':
        return 'bg-red-100 text-red-700';
      case 'ADJUSTMENT':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/products/${product.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a producto
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Historial de Stock</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-slate-500">Producto:</span>{' '}
            <span className="font-medium text-slate-700">{product.description}</span>
          </div>
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
        </div>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">Stock actual:</span>
          <span className="text-xl font-semibold text-blue-800">{product.stock}</span>
          <span className="text-sm text-blue-600">unidades</span>
        </div>
      </div>

      {/* Movements table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Movimientos ({movements.length})
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
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Motivo
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm">No hay movimientos registrados</p>
                    <p className="text-xs text-slate-300 mt-1">
                      Los movimientos aparecerán cuando se ingrese o egrese stock
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{formatDate(movement.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getTypeColor(movement.type)}`}
                    >
                      {getTypeLabel(movement.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`text-sm font-medium ${
                        movement.quantity > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {movement.quantity > 0 ? '+' : ''}
                      {movement.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-slate-500">{movement.previousStock}</span>
                    <span className="text-slate-300 mx-1">→</span>
                    <span className="text-sm font-medium text-slate-900">{movement.newStock}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      {movement.reason || '—'}
                    </div>
                    {movement.invoice && (
                      <Link
                        href={`/invoices/${movement.invoice.id}`}
                        className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Factura {movement.invoice.number}
                      </Link>
                    )}
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
