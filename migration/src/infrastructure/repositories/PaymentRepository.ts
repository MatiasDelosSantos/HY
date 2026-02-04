// =============================================================================
// PAYMENT REPOSITORY
// =============================================================================
// Persistencia de pagos/cobranzas usando Prisma
// =============================================================================

import { PrismaClient } from '@prisma/client';
import {
  PaymentEntity,
  PaymentAllocationEntity,
  CreatePaymentInput,
} from './types';
import { toDomainDecimal, toPrismaDecimal } from './mappers';

/**
 * Interfaz del repositorio de pagos
 */
export interface IPaymentRepository {
  create(input: CreatePaymentInput): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  listByCustomer(customerId: string): Promise<PaymentEntity[]>;
}

/**
 * Mapea allocation de Prisma a entidad
 */
function mapAllocationToEntity(record: any): PaymentAllocationEntity {
  return {
    id: record.id,
    paymentId: record.paymentId,
    invoiceId: record.invoiceId,
    amount: toDomainDecimal(record.amount),
    createdAt: record.createdAt,
  };
}

/**
 * Mapea pago de Prisma a entidad
 */
function mapToEntity(record: any): PaymentEntity {
  return {
    id: record.id,
    receiptNumber: record.receiptNumber,
    date: record.date,
    customerId: record.customerId,
    amount: toDomainDecimal(record.amount),
    paymentType: record.paymentType,
    allocations: record.allocations?.map(mapAllocationToEntity) ?? [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Implementación del repositorio de pagos
 */
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Crea un pago con allocations (transacción)
   */
  async create(input: CreatePaymentInput): Promise<PaymentEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      // Crear pago
      const payment = await tx.payment.create({
        data: {
          receiptNumber: input.receiptNumber,
          date: input.date,
          customerId: input.customerId,
          amount: toPrismaDecimal(input.amount),
          paymentType: input.paymentType ?? null,
        },
      });

      // Crear allocations
      if (input.allocations.length > 0) {
        await tx.paymentAllocation.createMany({
          data: input.allocations.map((allocation) => ({
            paymentId: payment.id,
            invoiceId: allocation.invoiceId,
            amount: toPrismaDecimal(allocation.amount),
          })),
        });
      }

      // Retornar pago con allocations
      return tx.payment.findUnique({
        where: { id: payment.id },
        include: { allocations: true },
      });
    });

    return mapToEntity(record);
  }

  /**
   * Busca pago por ID con allocations
   */
  async findById(id: string): Promise<PaymentEntity | null> {
    const record = await this.prisma.payment.findUnique({
      where: { id },
      include: { allocations: true },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Lista pagos de un cliente
   */
  async listByCustomer(customerId: string): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      where: { customerId },
      include: { allocations: true },
      orderBy: { date: 'desc' },
    });

    return records.map(mapToEntity);
  }
}
