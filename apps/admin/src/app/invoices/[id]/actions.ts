'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface PaymentLine {
  method: 'CASH' | 'TRANSFER' | 'CARD' | 'CHECK';
  amount: number;
}

interface CreatePaymentInput {
  invoiceId: string;
  lines: PaymentLine[];
}

export async function createPaymentForInvoice(input: CreatePaymentInput) {
  const { invoiceId, lines } = input;

  // Validaciones
  if (!lines || lines.length === 0) throw new Error('Debe agregar al menos un método de pago');
  for (const line of lines) {
    if (line.amount <= 0) throw new Error('Cada monto debe ser mayor a 0');
  }

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  if (total <= 0) throw new Error('El total debe ser mayor a 0');

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new Error('Factura no encontrada');

  // Traer facturas pendientes del cliente ordenadas por fecha
  const pendingInvoices = await prisma.invoice.findMany({
    where: {
      customerId: invoice.customerId,
      status: { in: ['PENDING', 'PARTIAL'] },
      balance: { gt: 0 },
    },
    orderBy: { date: 'asc' },
  });

  // Priorizar la factura actual primero
  const sortedInvoices = [
    invoice,
    ...pendingInvoices.filter((i) => i.id !== invoiceId),
  ].filter((i) => Number(i.balance) > 0);

  // Procesar pago con lógica FIFO
  let remaining = total;
  const allocations: { invoiceId: string; amount: number }[] = [];
  const invoiceUpdates: { id: string; balance: number; status: 'PENDING' | 'PARTIAL' | 'PAID' }[] = [];

  for (const inv of sortedInvoices) {
    if (remaining <= 0) break;

    const balance = Number(inv.balance);
    const toApply = Math.min(remaining, balance);
    const newBalance = balance - toApply;
    const newStatus = newBalance === 0 ? 'PAID' : 'PARTIAL';

    allocations.push({ invoiceId: inv.id, amount: toApply });
    invoiceUpdates.push({ id: inv.id, balance: newBalance, status: newStatus });
    remaining -= toApply;
  }

  const appliedAmount = total - remaining;
  const creditAmount = remaining;

  // Generar número de recibo: R + prefijo mensual + correlativo
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const prefix = 'R' + ((year - 1980) * 12 + month + 1).toString();

  const monthStart = new Date(year, now.getMonth(), 1);
  const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59, 999);

  const lastPayment = await prisma.payment.findFirst({
    where: {
      date: { gte: monthStart, lte: monthEnd },
      receiptNumber: { startsWith: prefix },
    },
    orderBy: { receiptNumber: 'desc' },
  });

  let nextSeq = 1;
  if (lastPayment) {
    const lastSeq = parseInt(lastPayment.receiptNumber.slice(prefix.length), 10);
    if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
  }
  const receiptNumber = prefix + nextSeq.toString().padStart(6, '0');

  // Persistir en transacción
  await prisma.$transaction(async (tx) => {
    // Crear payment con methodLines y allocations
    await tx.payment.create({
      data: {
        receiptNumber,
        date: now,
        customerId: invoice.customerId,
        amount: total,
        methodLines: {
          create: lines.map((l) => ({
            method: l.method,
            amount: l.amount,
          })),
        },
        allocations: {
          create: allocations,
        },
      },
    });

    // Actualizar facturas
    for (const upd of invoiceUpdates) {
      await tx.invoice.update({
        where: { id: upd.id },
        data: { balance: upd.balance, status: upd.status },
      });
    }
  });

  revalidatePath(`/invoices/${invoiceId}`);
  revalidatePath('/invoices');
  revalidatePath('/payments');

  return { success: true, appliedAmount, creditAmount, receiptNumber };
}
