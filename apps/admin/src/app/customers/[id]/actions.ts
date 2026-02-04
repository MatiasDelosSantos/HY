'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

interface UpdateCustomerInput {
  id: string;
  businessName: string;
  address?: string;
  taxId?: string;
  phone?: string;
  taxStatus?: 'RESPONSABLE_INSCRIPTO' | 'RESPONSABLE_NO_INSCRIPTO' | 'MONOTRIBUTO' | 'CONSUMIDOR_FINAL' | 'EXENTO';
  invoiceType?: 'A' | 'B' | 'C';
  priceList: 'PUBLICO' | 'GREMIO' | 'MAYORISTA';
}

export async function updateCustomer(input: UpdateCustomerInput) {
  const { id, businessName, address, taxId, phone, taxStatus, invoiceType, priceList } = input;

  if (!businessName || businessName.trim().length === 0) {
    throw new Error('La razón social es requerida');
  }

  if (businessName.length > 150) {
    throw new Error('La razón social no puede exceder 150 caracteres');
  }

  if (taxId && taxId.length > 13) {
    throw new Error('El CUIT no puede exceder 13 caracteres');
  }

  // Validate CUIT format if provided (XX-XXXXXXXX-X)
  if (taxId && taxId.trim().length > 0) {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(taxId)) {
      throw new Error('El CUIT debe tener el formato XX-XXXXXXXX-X');
    }
  }

  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) {
    throw new Error('Cliente no encontrado');
  }

  await prisma.customer.update({
    where: { id },
    data: {
      businessName: businessName.trim(),
      address: address?.trim() || null,
      taxId: taxId?.trim() || null,
      phone: phone?.trim() || null,
      taxStatus: taxStatus || null,
      invoiceType: invoiceType || null,
      priceList: priceList || 'PUBLICO',
    },
  });

  revalidatePath(`/customers/${id}`);
  revalidatePath('/customers');
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      invoices: { select: { id: true }, take: 1 },
      payments: { select: { id: true }, take: 1 },
    },
  });

  if (!customer) {
    throw new Error('Cliente no encontrado');
  }

  // Check if customer has invoices or payments
  if (customer.invoices.length > 0 || customer.payments.length > 0) {
    throw new Error('No se puede eliminar un cliente con facturas o pagos asociados');
  }

  await prisma.customer.delete({ where: { id } });

  revalidatePath('/customers');
  redirect('/customers');
}
