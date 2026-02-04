'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

interface UpdateSupplierInput {
  businessName: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email: string;
  isActive: boolean;
}

export async function updateSupplier(id: string, input: UpdateSupplierInput) {
  const { businessName, address, taxId, phone, email, isActive } = input;

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

  if (taxId && taxId.length > 13) {
    throw new Error('El CUIT no puede exceder 13 caracteres');
  }

  if (taxId && taxId.trim().length > 0) {
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(taxId)) {
      throw new Error('El CUIT debe tener el formato XX-XXXXXXXX-X');
    }
  }

  // Check if email already exists for another supplier
  const existingSupplier = await prisma.supplier.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      id: { not: id },
    },
  });

  if (existingSupplier) {
    throw new Error('Ya existe otro proveedor con este email');
  }

  // Check if CUIT already exists for another supplier
  if (taxId && taxId.trim().length > 0) {
    const existingCuit = await prisma.supplier.findFirst({
      where: {
        taxId: taxId.trim(),
        id: { not: id },
      },
    });
    if (existingCuit) {
      throw new Error('Ya existe otro proveedor con este CUIT');
    }
  }

  await prisma.supplier.update({
    where: { id },
    data: {
      businessName: businessName.trim(),
      address: address?.trim() || null,
      taxId: taxId?.trim() || null,
      phone: phone?.trim() || null,
      email: email.toLowerCase().trim(),
      isActive,
    },
  });

  redirect(`/suppliers/${id}`);
}

export async function resetSupplierPassword(id: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('La contrasena debe tener al menos 6 caracteres');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.supplier.update({
    where: { id },
    data: {
      passwordHash,
      sessionToken: null,
      sessionExpiresAt: null,
    },
  });

  return { success: true };
}

export async function toggleSupplierStatus(id: string) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!supplier) {
    throw new Error('Proveedor no encontrado');
  }

  await prisma.supplier.update({
    where: { id },
    data: {
      isActive: !supplier.isActive,
      sessionToken: !supplier.isActive ? undefined : null,
      sessionExpiresAt: !supplier.isActive ? undefined : null,
    },
  });

  redirect(`/suppliers/${id}`);
}
