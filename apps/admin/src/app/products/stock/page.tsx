import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StockFilters } from '@/components/StockFilters';

interface Props {
  searchParams: { code?: string; brand?: string; description?: string };
}

export default async function StockPage({ searchParams }: Props) {
  const { code, brand, description } = searchParams;

  // Get all distinct brands for the dropdown
  const brands = await prisma.product.findMany({
    where: { brand: { not: null } },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });
  const brandList = brands.map((b) => b.brand!).filter(Boolean);

  // Build filters
  const where: Record<string, unknown> = {};
  if (code) {
    where.code = { contains: code, mode: 'insensitive' };
  }
  if (brand) {
    where.brand = brand;
  }
  if (description) {
    where.description = { contains: description, mode: 'insensitive' };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { code: 'asc' },
    select: {
      id: true,
      code: true,
      brand: true,
      description: true,
      stock: true,
    },
  });

  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5).length;

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
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Stock de Productos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Inventario actual con filtros
          </p>
        </div>
        <Link
          href="/products/stock-entry"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ingresar stock
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total productos</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{totalProducts}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Sin stock</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">{outOfStock}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Stock bajo (&lt;5)</div>
          <div className="mt-1 text-2xl font-semibold text-amber-600">{lowStock}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <StockFilters brands={brandList} />
      </div>

      {/* Table - Compact style */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Código
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-400 text-sm">
                  No se encontraron productos con los filtros aplicados
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockClass =
                  product.stock === 0
                    ? 'text-red-600 font-semibold'
                    : product.stock < 5
                      ? 'text-amber-600 font-medium'
                      : 'text-slate-900';

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <Link
                        href={`/products/${product.id}/stock-history`}
                        className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {product.code}
                      </Link>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      <span className="text-sm text-slate-600">
                        {product.brand ?? <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="text-sm text-slate-900">{product.description}</span>
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap text-right">
                      <span className={`text-sm ${stockClass}`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
          Total: {totalProducts} productos | Sin stock: {outOfStock}
        </div>
      </div>
    </div>
  );
}
