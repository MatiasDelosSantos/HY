// =============================================================================
// INVOICE REPOSITORY
// =============================================================================
// Persistencia de facturas/remitos usando Prisma
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { Decimal } from '../../domain/types/decimal';
import { InvoiceStatus } from '../../domain/services/PaymentService';
import {
  InvoiceEntity,
  InvoiceItemEntity,
  CreateInvoiceInput,
  DocumentType,
} from './types';
import { toDomainDecimal, toPrismaDecimal, toDomainInvoiceStatus } from './mappers';
import { InvoiceStatus as PrismaInvoiceStatus } from '@prisma/client';

/**
 * Interfaz del repositorio de facturas
 */
export interface IInvoiceRepository {
  create(input: CreateInvoiceInput): Promise<InvoiceEntity>;
  findById(id: string): Promise<InvoiceEntity | null>;
  listByCustomer(customerId: string): Promise<InvoiceEntity[]>;
  updateStatusAndBalance(id: string, status: InvoiceStatus, balance: Decimal): Promise<InvoiceEntity>;
}

/**
 * Convierte InvoiceStatus de dominio a Prisma
 */
function toPrismaInvoiceStatus(status: InvoiceStatus): PrismaInvoiceStatus {
  switch (status) {
    case InvoiceStatus.PENDING:
      return 'PENDING';
    case InvoiceStatus.PARTIAL:
      return 'PARTIAL';
    case InvoiceStatus.PAID:
      return 'PAID';
    default:
      return 'PENDING';
  }
}

/**
 * Mapea item de factura de Prisma a entidad
 */
function mapItemToEntity(record: any): InvoiceItemEntity {
  return {
    id: record.id,
    invoiceId: record.invoiceId,
    productId: record.productId,
    quantity: toDomainDecimal(record.quantity),
    unitPrice: toDomainDecimal(record.unitPrice),
    discount: toDomainDecimal(record.discount),
    total: toDomainDecimal(record.total),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Mapea factura de Prisma a entidad
 */
function mapToEntity(record: any): InvoiceEntity {
  return {
    id: record.id,
    type: record.type as DocumentType,
    number: record.number,
    date: record.date,
    dueDate: record.dueDate,
    customerId: record.customerId,
    status: toDomainInvoiceStatus(record.status),
    subtotal: toDomainDecimal(record.subtotal),
    discount: toDomainDecimal(record.discount),
    tax21: toDomainDecimal(record.tax21),
    total: toDomainDecimal(record.total),
    balance: toDomainDecimal(record.balance),
    relatedInvoiceId: record.relatedInvoiceId,
    items: record.items?.map(mapItemToEntity) ?? [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Implementación del repositorio de facturas
 */
export class InvoiceRepository implements IInvoiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Crea una factura con items (transacción)
   */
  async create(input: CreateInvoiceInput): Promise<InvoiceEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      // Crear factura
      const invoice = await tx.invoice.create({
        data: {
          type: input.type ?? 'SALE',
          number: input.number,
          date: input.date,
          dueDate: input.dueDate ?? null,
          customerId: input.customerId,
          status: toPrismaInvoiceStatus(input.status ?? InvoiceStatus.PENDING),
          subtotal: toPrismaDecimal(input.subtotal),
          discount: toPrismaDecimal(input.discount ?? Decimal.zero()),
          tax21: toPrismaDecimal(input.tax21),
          total: toPrismaDecimal(input.total),
          balance: toPrismaDecimal(input.balance),
          relatedInvoiceId: input.relatedInvoiceId ?? null,
        },
      });

      // Crear items
      if (input.items.length > 0) {
        await tx.invoiceItem.createMany({
          data: input.items.map((item) => ({
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: toPrismaDecimal(item.quantity),
            unitPrice: toPrismaDecimal(item.unitPrice),
            discount: toPrismaDecimal(item.discount ?? Decimal.zero()),
            total: toPrismaDecimal(item.total),
          })),
        });
      }

      // Retornar factura con items
      return tx.invoice.findUnique({
        where: { id: invoice.id },
        include: { items: true },
      });
    });

    return mapToEntity(record);
  }

  /**
   * Busca factura por ID con items
   */
  async findById(id: string): Promise<InvoiceEntity | null> {
    const record = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Lista facturas de un cliente
   */
  async listByCustomer(customerId: string): Promise<InvoiceEntity[]> {
    const records = await this.prisma.invoice.findMany({
      where: { customerId },
      include: { items: true },
      orderBy: { date: 'desc' },
    });

    return records.map(mapToEntity);
  }

  /**
   * Actualiza estado y balance de una factura
   * Usado principalmente por el proceso de cobranza
   */
  async updateStatusAndBalance(
    id: string,
    status: InvoiceStatus,
    balance: Decimal
  ): Promise<InvoiceEntity> {
    const record = await this.prisma.invoice.update({
      where: { id },
      data: {
        status: toPrismaInvoiceStatus(status),
        balance: toPrismaDecimal(balance),
      },
      include: { items: true },
    });

    return mapToEntity(record);
  }
}
