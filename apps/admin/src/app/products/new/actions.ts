'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface CreateProductInput {
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

export async function getNextProductCode(): Promise<string> {
  const lastProduct = await prisma.product.findFirst({
    orderBy: { code: 'desc' },
    select: { code: true },
  });

  if (!lastProduct) {
    return '00001';
  }

  const lastCode = parseInt(lastProduct.code, 10);
  const nextCode = (lastCode + 1).toString().padStart(5, '0');
  return nextCode;
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

export async function createProduct(input: CreateProductInput) {
  const {
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

  // Generate next code
  const code = await getNextProductCode();

  const product = await prisma.product.create({
    data: {
      code,
      brand: brand?.trim() || null,
      description: description.trim(),
      manufacturerCode: manufacturerCode?.trim() || null,
      pricing: {
        create: {
          costPrice,
          publicMarkup,
          tradeMarkup,
          wholesaleMarkup,
          publicPrice,
          tradePrice,
          wholesalePrice,
        },
      },
    },
  });

  redirect(`/products/${product.id}`);
}
