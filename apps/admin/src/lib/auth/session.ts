import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

const SESSION_COOKIE_NAME = 'supplier_session';
const SESSION_DURATION_HOURS = 24;

/**
 * Genera un token de sesión seguro
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Crea una nueva sesión para un proveedor
 */
export async function createSupplierSession(supplierId: string): Promise<string> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      sessionToken: token,
      sessionExpiresAt: expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return token;
}

/**
 * Obtiene el proveedor de la sesión actual
 */
export async function getSupplierFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const supplier = await prisma.supplier.findFirst({
    where: {
      sessionToken: token,
      sessionExpiresAt: { gt: new Date() },
      isActive: true,
    },
    select: {
      id: true,
      code: true,
      businessName: true,
      email: true,
    },
  });

  return supplier;
}

/**
 * Verifica si hay una sesión activa de proveedor
 */
export async function isSupplierAuthenticated(): Promise<boolean> {
  const supplier = await getSupplierFromSession();
  return supplier !== null;
}

/**
 * Cierra la sesión del proveedor
 */
export async function destroySupplierSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await prisma.supplier.updateMany({
      where: { sessionToken: token },
      data: {
        sessionToken: null,
        sessionExpiresAt: null,
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
