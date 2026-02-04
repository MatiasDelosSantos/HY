'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface BulkUpdateInput {
  priceField: 'publicPrice' | 'tradePrice' | 'wholesalePrice';
  brandFrom: string;
  brandTo: string;
  percentage: number;
}

export async function getBrands(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { brand: { not: null } },
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });

  return products
    .map((p) => p.brand)
    .filter((b): b is string => b !== null);
}

export async function getProductCountInRange(brandFrom: string, brandTo: string): Promise<number> {
  const count = await prisma.product.count({
    where: {
      brand: {
        gte: brandFrom,
        lte: brandTo,
      },
    },
  });

  return count;
}

export async function bulkUpdatePrices(input: BulkUpdateInput) {
  const { priceField, brandFrom, brandTo, percentage } = input;

  if (percentage === 0) {
    throw new Error('El porcentaje debe ser diferente de 0');
  }

  if (!brandFrom || !brandTo) {
    throw new Error('Debe seleccionar el rango de marcas');
  }

  // Get products in range
  const products = await prisma.product.findMany({
    where: {
      brand: {
        gte: brandFrom,
        lte: brandTo,
      },
      pricing: { isNot: null },
    },
    include: { pricing: true },
  });

  if (products.length === 0) {
    throw new Error('No hay productos en el rango seleccionado');
  }

  const multiplier = 1 + percentage / 100;

  // Update each product's pricing
  await prisma.$transaction(
    products.map((product) => {
      const currentPrice = Number(product.pricing![priceField]);
      const newPrice = Math.round(currentPrice * multiplier * 100) / 100;

      return prisma.productPricing.update({
        where: { productId: product.id },
        data: { [priceField]: newPrice },
      });
    })
  );

  revalidatePath('/products');
  revalidatePath('/products/bulk-update');

  return { updatedCount: products.length };
}
