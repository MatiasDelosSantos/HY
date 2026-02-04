import Link from 'next/link';
import { ProductForm } from './ProductForm';
import { getNextProductCode, getBrands } from './actions';

export default async function NewProductPage() {
  const [nextCode, existingBrands] = await Promise.all([
    getNextProductCode(),
    getBrands(),
  ]);

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
        <h1 className="text-2xl font-semibold text-slate-900">Nuevo producto</h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete los datos para registrar un nuevo producto
        </p>
      </div>

      <ProductForm nextCode={nextCode} existingBrands={existingBrands} />
    </div>
  );
}
