// =============================================================================
// MAPPERS - Prisma ↔ Domain
// =============================================================================
// Conversión entre tipos de base de datos y tipos de dominio
// =============================================================================

import { Decimal as PrismaDecimal } from '@prisma/client/runtime/library';
import { Decimal } from '../../domain/types/decimal';
import { InvoiceStatus } from '../../domain/services/PaymentService';

// =============================================================================
// DECIMAL CONVERSION
// =============================================================================

/**
 * Convierte Prisma Decimal a Domain Decimal
 */
export function toDomainDecimal(prismaDecimal: PrismaDecimal | null): Decimal {
  if (prismaDecimal === null) {
    return Decimal.zero();
  }
  return Decimal.fromString(prismaDecimal.toString());
}

/**
 * Convierte Domain Decimal a número para Prisma
 * Prisma acepta number para campos Decimal
 */
export function toPrismaDecimal(domainDecimal: Decimal): number {
  return domainDecimal.toNumber();
}

// =============================================================================
// ENUM CONVERSION
// =============================================================================

/**
 * Mapeo de enum InvoiceStatus dominio ↔ DB
 */
export function toDomainInvoiceStatus(dbStatus: string): InvoiceStatus {
  switch (dbStatus) {
    case 'PENDING':
      return InvoiceStatus.PENDING;
    case 'PARTIAL':
      return InvoiceStatus.PARTIAL;
    case 'PAID':
      return InvoiceStatus.PAID;
    default:
      return InvoiceStatus.PENDING;
  }
}

// =============================================================================
// DATE CONVERSION
// =============================================================================

/**
 * Asegura que una fecha sea un objeto Date válido
 */
export function toDate(value: Date | string): Date {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
}
