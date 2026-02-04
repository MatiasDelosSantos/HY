'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

interface CreateSupplierInput {
  businessName: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email: string;
  password: string;
}

export async function getNextSupplierCode(): Promise<string> {
  const lastSupplier = await prisma.supplier.findFirst({
    orderBy: { code: 'desc' },
    select: { code: true },
  });

  if (!lastSupplier) {
    return '00001';
  }

  const lastCode = parseInt(lastSupplier.code, 10);
  const nextCode = (lastCode + 1).toString().padStart(5, '0');
  return nextCode;
}

export async function createSupplier(input: CreateSupplierInput) {
  const { businessName, address, taxId, phone, email, password } = input;

  if (!businessName || businessName.trim().length === 0) {
    throw new Error('La razon social es requerida');
  }

  if (businessName.length > 150) {
    throw new Error('La razon social no puede exceder 150 caracteres');
  }

  if (!email || email.trim().length === 0) {
    throw new Error('El email es requerido');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('El email no tiene un formato valido');
  }

  if (!password || password.length < 6) {
    throw new Error('La contrasena debe tener al menos 6 caracteres');
  }

  if (taxId && taxId.length > 13) {
    throw new Error('El CUIT no puede exceder 13 caracteres');
  }

  if (taxId && taxId.trim().length > 0) {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(taxId)) {
      throw new Error('El CUIT debe tener el formato XX-XXXXXXXX-X');
    }
  }

  // Check if email already exists
  const existingSupplier = await prisma.supplier.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingSupplier) {
    throw new Error('Ya existe un proveedor con este email');
  }

  // Check if CUIT already exists
  if (taxId && taxId.trim().length > 0) {
    const existingCuit = await prisma.supplier.findUnique({
      where: { taxId: taxId.trim() },
    });
    if (existingCuit) {
      throw new Error('Ya existe un proveedor con este CUIT');
    }
  }

  const code = await getNextSupplierCode();
  const passwordHash = await bcrypt.hash(password, 10);

  const supplier = await prisma.supplier.create({
    data: {
      code,
      businessName: businessName.trim(),
      address: address?.trim() || null,
      taxId: taxId?.trim() || null,
      phone: phone?.trim() || null,
      email: email.toLowerCase().trim(),
      passwordHash,
      isActive: true,
    },
  });

  redirect(`/suppliers/${supplier.id}`);
}
