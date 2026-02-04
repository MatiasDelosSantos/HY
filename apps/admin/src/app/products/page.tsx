import { prisma } from '@/lib/prisma';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { code: 'asc' },
    include: { pricing: true },
  });

  const withPublicPrice = products.filter(
    (p) => p.pricing && Number(p.pricing.publicPrice) > 0
  ).length;
  const withoutPrice = products.filter(
    (p) => !p.pricing || Number(p.pricing.publicPrice) === 0
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Productos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Catálogo de productos y precios por lista
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{products.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Con precio público</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{withPublicPrice}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Sin precio</div>
          <div className="mt-1 text-2xl font-semibold text-amber-600">{withoutPrice}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio Público
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Precio Gremio
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                    <p className="text-sm">No hay productos registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const hasPrice = product.pricing && Number(product.pricing.publicPrice) > 0;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors cursor-default"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {product.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{product.description}</div>
                      {product.manufacturerCode && (
                        <div className="text-sm text-slate-500">
                          Cód. fábrica: {product.manufacturerCode}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {product.brand ?? <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {hasPrice ? (
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(Number(product.pricing!.publicPrice))}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          Sin precio
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {product.pricing && Number(product.pricing.tradePrice) > 0 ? (
                        <span className="text-sm text-slate-600">
                          {formatCurrency(Number(product.pricing.tradePrice))}
                        </span>
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
