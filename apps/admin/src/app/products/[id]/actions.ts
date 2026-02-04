'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface UpdateProductInput {
  id: string;
  brand?: string;
  description: string;
  manufacturerCode?: string;
  costPrice: number;
  publicMarkup: number;
  tradeMarkup: number;
  wholesaleMarkup: number;
  publicPrice: number;
  tradePrice: number;
  wholesalePrice: number;
}

export async function updateProduct(input: UpdateProductInput) {
  const {
    id,
    brand,
    description,
    manufacturerCode,
    costPrice,
    publicMarkup,
    tradeMarkup,
    wholesaleMarkup,
    publicPrice,
    tradePrice,
    wholesalePrice,
  } = input;

  if (!description || description.trim().length === 0) {
    throw new Error('La descripción es requerida');
  }

  if (description.length > 150) {
    throw new Error('La descripción no puede exceder 150 caracteres');
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { pricing: true },
  });

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  await prisma.$transaction(async (tx) => {
    // Update product
    await tx.product.update({
      where: { id },
      data: {
        brand: brand?.trim() || null,
        description: description.trim(),
        manufacturerCode: manufacturerCode?.trim() || null,
      },
    });

    // Upsert pricing
    if (product.pricing) {
      await tx.productPricing.update({
        where: { productId: id },
        data: {
          costPrice,
          publicMarkup,
          tradeMarkup,
          wholesaleMarkup,
          publicPrice,
          tradePrice,
          wholesalePrice,
        },
      });
    } else {
      await tx.productPricing.create({
        data: {
          productId: id,
          costPrice,
          publicMarkup,
          tradeMarkup,
          wholesaleMarkup,
          publicPrice,
          tradePrice,
          wholesalePrice,
        },
      });
    }
  });

  revalidatePath(`/products/${id}`);
  revalidatePath('/products');
  redirect(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      invoiceItems: { select: { id: true }, take: 1 },
    },
  });

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  // Check if product has invoice items
  if (product.invoiceItems.length > 0) {
    throw new Error('No se puede eliminar un producto que ha sido vendido');
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath('/products');
  redirect('/products');
}
