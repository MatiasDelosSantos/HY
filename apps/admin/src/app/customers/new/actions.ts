'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

interface CreateCustomerInput {
  businessName: string;
  address?: string;
  taxId?: string;
  phone?: string;
  taxStatus?: 'RESPONSABLE_INSCRIPTO' | 'RESPONSABLE_NO_INSCRIPTO' | 'MONOTRIBUTO' | 'CONSUMIDOR_FINAL' | 'EXENTO';
  invoiceType?: 'A' | 'B' | 'C';
  priceList: 'PUBLICO' | 'GREMIO' | 'MAYORISTA';
}

export async function getNextCustomerCode(): Promise<string> {
  const lastCustomer = await prisma.customer.findFirst({
    orderBy: { code: 'desc' },
    select: { code: true },
  });

  if (!lastCustomer) {
    return '00001';
  }

  const lastCode = parseInt(lastCustomer.code, 10);
  const nextCode = (lastCode + 1).toString().padStart(5, '0');
  return nextCode;
}

export async function createCustomer(input: CreateCustomerInput) {
  const { businessName, address, taxId, phone, taxStatus, invoiceType, priceList } = input;

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

  // Generate next code
  const code = await getNextCustomerCode();

  const customer = await prisma.customer.create({
    data: {
      code,
      businessName: businessName.trim(),
      address: address?.trim() || null,
      taxId: taxId?.trim() || null,
      phone: phone?.trim() || null,
      taxStatus: taxStatus || null,
      invoiceType: invoiceType || null,
      priceList: priceList || 'PUBLICO',
    },
  });

  redirect(`/customers/${customer.id}`);
}
