import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SupplierEditForm } from './SupplierEditForm';

interface Props {
  params: { id: string };
}

export default async function EditSupplierPage({ params }: Props) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
  });

  if (!supplier) {
    notFound();
  }

  const serializedSupplier = {
    id: supplier.id,
    code: supplier.code,
    businessName: supplier.businessName,
    address: supplier.address,
    taxId: supplier.taxId,
    phone: supplier.phone,
    email: supplier.email,
    isActive: supplier.isActive,
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/suppliers/${supplier.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a {supplier.businessName}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Editar proveedor</h1>
        <p className="mt-1 text-sm text-slate-500">
          {supplier.businessName} ({supplier.code})
        </p>
      </div>

      <SupplierEditForm supplier={serializedSupplier} />
    </div>
  );
}
