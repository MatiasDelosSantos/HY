import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProductEditForm } from './ProductEditForm';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { pricing: true },
  });

  if (!product) {
    notFound();
  }

  // Get existing brands for datalist
  const brands = await prisma.product.findMany({
    where: { brand: { not: null } },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });

  const existingBrands = brands
    .map((p) => p.brand)
    .filter((b): b is string => b !== null);

  const serializedProduct = {
    id: product.id,
    code: product.code,
    brand: product.brand,
    description: product.description,
    manufacturerCode: product.manufacturerCode,
    pricing: product.pricing
      ? {
          costPrice: Number(product.pricing.costPrice),
          publicMarkup: Number(product.pricing.publicMarkup),
          tradeMarkup: Number(product.pricing.tradeMarkup),
          wholesaleMarkup: Number(product.pricing.wholesaleMarkup),
          publicPrice: Number(product.pricing.publicPrice),
          tradePrice: Number(product.pricing.tradePrice),
          wholesalePrice: Number(product.pricing.wholesalePrice),
        }
      : null,
  };

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
        Volver a {product.description}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Editar producto</h1>
        <p className="mt-1 text-sm text-slate-500">
          {product.description} ({product.code})
        </p>
      </div>

      <ProductEditForm product={serializedProduct} existingBrands={existingBrands} />
    </div>
  );
}
