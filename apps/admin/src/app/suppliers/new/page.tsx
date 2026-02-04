import Link from 'next/link';
import { SupplierForm } from './SupplierForm';
import { getNextSupplierCode } from './actions';

export default async function NewSupplierPage() {
  const nextCode = await getNextSupplierCode();

  return (
    <div>
      {/* Back link */}
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Proveedores
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Nuevo proveedor</h1>
        <p className="mt-1 text-sm text-slate-500">
          Complete los datos para registrar un nuevo proveedor
        </p>
      </div>

      <SupplierForm nextCode={nextCode} />
    </div>
  );
}
