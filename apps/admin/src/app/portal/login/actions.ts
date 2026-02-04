'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createSupplierSession, destroySupplierSession } from '@/lib/auth/session';

interface LoginInput {
  email: string;
  password: string;
}

export async function authenticateSupplier(input: LoginInput) {
  const { email, password } = input;

  if (!email || !password) {
    return { error: 'Email y contrasena son requeridos' };
  }

  const supplier = await prisma.supplier.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!supplier) {
    return { error: 'Credenciales invalidas' };
  }

  if (!supplier.isActive) {
    return { error: 'Tu cuenta esta inactiva. Contacta al administrador.' };
  }

  const isValidPassword = await bcrypt.compare(password, supplier.passwordHash);

  if (!isValidPassword) {
    return { error: 'Credenciales invalidas' };
  }

  await createSupplierSession(supplier.id);

  redirect('/portal/upload');
}

export async function logoutSupplier() {
  await destroySupplierSession();
  redirect('/portal/login');
}
