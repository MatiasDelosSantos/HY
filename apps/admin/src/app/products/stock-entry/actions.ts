'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface StockEntryInput {
  productId: string;
  quantity: number;
  reason?: string;
}

export async function addStockEntry(input: StockEntryInput) {
  const { productId, quantity, reason } = input;

  if (!productId) {
    throw new Error('Producto requerido');
  }

  if (!quantity || quantity <= 0) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  const previousStock = product.stock;
  const newStock = previousStock + quantity;

  // Update stock and create movement in a transaction
  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    }),
    prisma.stockMovement.create({
      data: {
        productId,
        type: 'ENTRY',
        quantity,
        previousStock,
        newStock,
        reason: reason || 'Ingreso de mercadería',
      },
    }),
  ]);

  revalidatePath('/products');
  revalidatePath('/products/stock');
  revalidatePath(`/products/${productId}`);

  return { success: true, newStock };
}

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const q = query.trim().toLowerCase();

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { code: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { manufacturerCode: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 10,
    orderBy: { code: 'asc' },
  });

  return products.map((p) => ({
    id: p.id,
    code: p.code,
    description: p.description,
    brand: p.brand,
    stock: p.stock,
  }));
}
