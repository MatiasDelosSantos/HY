import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';

interface Props {
  searchParams: { q?: string };
}

export default async function ProductsPage({ searchParams }: Props) {
  const query = searchParams.q?.trim().toLowerCase();

  const allProducts = await prisma.product.findMany({
    orderBy: { code: 'asc' },
    include: { pricing: true },
  });

  // Filter products based on search query
  const products = query
    ? allProducts.filter(
        (p) =>
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query)) ||
          (p.manufacturerCode && p.manufacturerCode.toLowerCase().includes(query))
      )
    : allProducts;

  const withPublicPrice = allProducts.filter(
    (p) => p.pricing && Number(p.pricing.publicPrice) > 0
  ).length;
  const withoutPrice = allProducts.filter(
    (p) => !p.pricing || Number(p.pricing.publicPrice) === 0
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catálogo de productos y precios por lista
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/products/stock"
            className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Ver stock
          </Link>
          <Link
            href="/products/stock-entry"
            className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ingresar stock
          </Link>
          <div className="relative group">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir listado
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 hidden group-hover:block z-10">
              <Link
                href="/products/print?list=public"
                target="_blank"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Precio Público
              </Link>
              <Link
                href="/products/print?list=trade"
                target="_blank"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Precio Gremio
              </Link>
              <Link
                href="/products/print?list=wholesale"
                target="_blank"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Precio Mayorista
              </Link>
            </div>
          </div>
          <Link
            href="/products/calculator"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculadora
          </Link>
          <Link
            href="/products/bulk-update"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar precios
          </Link>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo producto
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{allProducts.length}</div>
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

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar placeholder="Buscar por código, descripción, marca..." />
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
                    <p className="text-sm">
                      {query ? 'No se encontraron productos' : 'No hay productos registrados'}
                    </p>
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
                      <Link
                        href={`/products/${product.id}`}
                        className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        {product.code}
                      </Link>
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
        {query && products.length > 0 && (
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
            Mostrando {products.length} de {allProducts.length} productos
          </div>
        )}
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
