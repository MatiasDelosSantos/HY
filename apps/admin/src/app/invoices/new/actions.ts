'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface CreateInvoiceInput {
  customerId: string;
  items: { productId: string; quantity: number }[];
}

export async function createInvoice(input: CreateInvoiceInput) {
  const { customerId, items } = input;

  if (!customerId || items.length === 0) {
    throw new Error('Datos inválidos');
  }

  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) throw new Error('Cliente no encontrado');

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    include: { pricing: true },
  });

  const itemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product?.pricing) throw new Error(`Producto ${item.productId} sin precio`);

    const unitPrice =
      customer.priceList === 'GREMIO' ? Number(product.pricing.tradePrice)
      : customer.priceList === 'MAYORISTA' ? Number(product.pricing.wholesalePrice)
      : Number(product.pricing.publicPrice);

    const total = unitPrice * item.quantity;
    return { productId: item.productId, quantity: item.quantity, unitPrice, discount: 0, total };
  });

  const subtotal = itemsData.reduce((sum, i) => sum + i.total, 0);

  // Generar número de factura: PPPXXXXXX (prefijo mensual + correlativo)
  // Prefijo = (año - 1980) * 12 + mes + 1
  // Feb 2026 = 555, Mar 2026 = 556, etc.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const prefix = ((year - 1980) * 12 + month + 1).toString();

  const monthStart = new Date(year, now.getMonth(), 1);
  const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59, 999);

  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      date: { gte: monthStart, lte: monthEnd },
      number: { startsWith: prefix },
    },
    orderBy: { number: 'desc' },
  });

  let nextSeq = 1;
  if (lastInvoice) {
    const lastSeq = parseInt(lastInvoice.number.slice(prefix.length), 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  const invoiceNumber = prefix + nextSeq.toString().padStart(6, '0');

  // Create invoice with stock movements in a transaction
  const invoice = await prisma.$transaction(async (tx) => {
    // Create the invoice
    const inv = await tx.invoice.create({
      data: {
        customerId,
        number: invoiceNumber,
        date: new Date(),
        status: 'PENDING',
        subtotal,
        discount: 0,
        tax21: 0,
        total: subtotal,
        balance: subtotal,
        items: { create: itemsData },
      },
    });

    // Update stock for each product and create stock movements
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!;
      const previousStock = product.stock;
      const newStock = previousStock - item.quantity;

      // Update product stock
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: newStock },
      });

      // Create stock movement record
      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          invoiceId: inv.id,
          type: 'EXIT',
          quantity: -item.quantity,
          previousStock,
          newStock,
          reason: `Venta Factura ${invoiceNumber}`,
        },
      });
    }

    return inv;
  });

  redirect(`/invoices/${invoice.id}`);
}

// Check stock availability for items (used by UI to show warnings)
export async function checkStockAvailability(items: { productId: string; quantity: number }[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, code: true, description: true, stock: true },
  });

  const warnings: { productId: string; code: string; description: string; requested: number; available: number }[] = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (product && item.quantity > product.stock) {
      warnings.push({
        productId: product.id,
        code: product.code,
        description: product.description,
        requested: item.quantity,
        available: product.stock,
      });
    }
  }

  return warnings;
}
