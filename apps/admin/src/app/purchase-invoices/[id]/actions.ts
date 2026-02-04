'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface UpdateInvoiceInput {
  type: 'A' | 'B' | 'C' | null;
  number: string | null;
  date: string | null;
  dueDate: string | null;
  subtotal: number;
  tax21: number;
  tax105: number;
  total: number;
  adminNotes: string | null;
}

export async function updatePurchaseInvoice(id: string, input: UpdateInvoiceInput) {
  await prisma.purchaseInvoice.update({
    where: { id },
    data: {
      type: input.type,
      number: input.number?.trim() || null,
      date: input.date ? new Date(input.date) : null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      subtotal: input.subtotal,
      tax21: input.tax21,
      tax105: input.tax105,
      total: input.total,
      adminNotes: input.adminNotes?.trim() || null,
      reviewedAt: new Date(),
    },
  });

  revalidatePath(`/purchase-invoices/${id}`);
  return { success: true };
}

export async function approvePurchaseInvoice(id: string) {
  const invoice = await prisma.purchaseInvoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    throw new Error('Factura no encontrada');
  }

  if (invoice.status !== 'PENDING_REVIEW' && invoice.status !== 'IN_REVIEW') {
    throw new Error('Solo se pueden aprobar facturas en revision');
  }

  await prisma.purchaseInvoice.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: new Date(),
      reviewedAt: new Date(),
    },
  });

  redirect('/purchase-invoices');
}

export async function rejectPurchaseInvoice(id: string, reason: string) {
  const invoice = await prisma.purchaseInvoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    throw new Error('Factura no encontrada');
  }

  if (invoice.status !== 'PENDING_REVIEW' && invoice.status !== 'IN_REVIEW') {
    throw new Error('Solo se pueden rechazar facturas en revision');
  }

  if (!reason || reason.trim().length === 0) {
    throw new Error('Debe indicar un motivo de rechazo');
  }

  await prisma.purchaseInvoice.update({
    where: { id },
    data: {
      status: 'REJECTED',
      rejectionReason: reason.trim(),
      reviewedAt: new Date(),
    },
  });

  redirect('/purchase-invoices');
}

export async function markAsPaid(id: string) {
  const invoice = await prisma.purchaseInvoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    throw new Error('Factura no encontrada');
  }

  if (invoice.status !== 'APPROVED') {
    throw new Error('Solo se pueden marcar como pagadas las facturas aprobadas');
  }

  await prisma.purchaseInvoice.update({
    where: { id },
    data: {
      status: 'PAID',
    },
  });

  revalidatePath(`/purchase-invoices/${id}`);
  return { success: true };
}
