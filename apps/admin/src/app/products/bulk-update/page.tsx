import Link from 'next/link';
import { BulkUpdateForm } from './BulkUpdateForm';
import { getBrands } from './actions';

export default async function BulkUpdatePage() {
  const brands = await getBrands();

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Actualización masiva de precios</h1>
        <p className="mt-1 text-sm text-slate-500">
          Actualice los precios de múltiples productos por porcentaje
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <h2 className="text-lg font-medium text-slate-900 mb-2">Sin marcas registradas</h2>
          <p className="text-sm text-slate-500 mb-6">
            Primero registre productos con marcas para poder realizar actualizaciones masivas.
          </p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear producto
          </Link>
        </div>
      ) : (
        <BulkUpdateForm brands={brands} />
      )}
    </div>
  );
}
