// =============================================================================
// CUSTOMER REPOSITORY
// =============================================================================
// Persistencia de clientes usando Prisma
// =============================================================================

import { PrismaClient } from '@prisma/client';
import {
  CustomerEntity,
  CreateCustomerInput,
  UpdateCustomerInput,
  TaxStatus,
  InvoiceLetterType,
  PriceListType,
} from './types';

/**
 * Interfaz del repositorio de clientes
 */
export interface ICustomerRepository {
  create(input: CreateCustomerInput): Promise<CustomerEntity>;
  findById(id: string): Promise<CustomerEntity | null>;
  findByCode(code: string): Promise<CustomerEntity | null>;
  list(): Promise<CustomerEntity[]>;
  update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity>;
}

/**
 * Mapea registro de Prisma a entidad de dominio
 */
function mapToEntity(record: any): CustomerEntity {
  return {
    id: record.id,
    code: record.code,
    businessName: record.businessName,
    address: record.address,
    taxId: record.taxId,
    phone: record.phone,
    taxStatus: record.taxStatus as TaxStatus | null,
    invoiceType: record.invoiceType as InvoiceLetterType | null,
    priceList: record.priceList as PriceListType,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Implementación del repositorio de clientes
 */
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Crea un nuevo cliente
   */
  async create(input: CreateCustomerInput): Promise<CustomerEntity> {
    const record = await this.prisma.customer.create({
      data: {
        code: input.code,
        businessName: input.businessName,
        address: input.address ?? null,
        taxId: input.taxId ?? null,
        phone: input.phone ?? null,
        taxStatus: input.taxStatus ?? null,
        invoiceType: input.invoiceType ?? null,
        priceList: input.priceList ?? 'PUBLICO',
      },
    });

    return mapToEntity(record);
  }

  /**
   * Busca cliente por ID (UUID)
   */
  async findById(id: string): Promise<CustomerEntity | null> {
    const record = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Busca cliente por código (ej: "00001")
   */
  async findByCode(code: string): Promise<CustomerEntity | null> {
    const record = await this.prisma.customer.findUnique({
      where: { code },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Lista todos los clientes
   */
  async list(): Promise<CustomerEntity[]> {
    const records = await this.prisma.customer.findMany({
      orderBy: { code: 'asc' },
    });

    return records.map(mapToEntity);
  }

  /**
   * Actualiza un cliente existente
   */
  async update(id: string, data: UpdateCustomerInput): Promise<CustomerEntity> {
    const record = await this.prisma.customer.update({
      where: { id },
      data: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.taxId !== undefined && { taxId: data.taxId }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.taxStatus !== undefined && { taxStatus: data.taxStatus }),
        ...(data.invoiceType !== undefined && { invoiceType: data.invoiceType }),
        ...(data.priceList !== undefined && { priceList: data.priceList }),
      },
    });

    return mapToEntity(record);
  }
}
