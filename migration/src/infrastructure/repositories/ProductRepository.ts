// =============================================================================
// PRODUCT REPOSITORY
// =============================================================================
// Persistencia de productos usando Prisma
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { Decimal } from '../../domain/types/decimal';
import {
  ProductEntity,
  ProductPricingEntity,
  CreateProductInput,
  UpdateProductInput,
} from './types';
import { toDomainDecimal, toPrismaDecimal } from './mappers';

/**
 * Interfaz del repositorio de productos
 */
export interface IProductRepository {
  create(input: CreateProductInput): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findByCode(code: string): Promise<ProductEntity | null>;
  list(): Promise<ProductEntity[]>;
  update(id: string, data: UpdateProductInput): Promise<ProductEntity>;
}

/**
 * Mapea pricing de Prisma a entidad
 */
function mapPricingToEntity(record: any): ProductPricingEntity {
  return {
    id: record.id,
    productId: record.productId,
    publicPrice: toDomainDecimal(record.publicPrice),
    tradePrice: toDomainDecimal(record.tradePrice),
    wholesalePrice: toDomainDecimal(record.wholesalePrice),
    costPrice: toDomainDecimal(record.costPrice),
    publicMarkup: toDomainDecimal(record.publicMarkup),
    tradeMarkup: toDomainDecimal(record.tradeMarkup),
    wholesaleMarkup: toDomainDecimal(record.wholesaleMarkup),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Mapea producto de Prisma a entidad
 */
function mapToEntity(record: any): ProductEntity {
  return {
    id: record.id,
    code: record.code,
    brand: record.brand,
    description: record.description,
    manufacturerCode: record.manufacturerCode,
    pricing: record.pricing ? mapPricingToEntity(record.pricing) : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Implementación del repositorio de productos
 */
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Crea un nuevo producto con pricing (transacción)
   */
  async create(input: CreateProductInput): Promise<ProductEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      // Crear producto
      const product = await tx.product.create({
        data: {
          code: input.code,
          brand: input.brand ?? null,
          description: input.description,
          manufacturerCode: input.manufacturerCode ?? null,
        },
      });

      // Crear pricing si se proporciona
      if (input.pricing) {
        await tx.productPricing.create({
          data: {
            productId: product.id,
            publicPrice: toPrismaDecimal(input.pricing.publicPrice ?? Decimal.zero()),
            tradePrice: toPrismaDecimal(input.pricing.tradePrice ?? Decimal.zero()),
            wholesalePrice: toPrismaDecimal(input.pricing.wholesalePrice ?? Decimal.zero()),
            costPrice: toPrismaDecimal(input.pricing.costPrice ?? Decimal.zero()),
            publicMarkup: toPrismaDecimal(input.pricing.publicMarkup ?? Decimal.zero()),
            tradeMarkup: toPrismaDecimal(input.pricing.tradeMarkup ?? Decimal.zero()),
            wholesaleMarkup: toPrismaDecimal(input.pricing.wholesaleMarkup ?? Decimal.zero()),
          },
        });
      }

      // Retornar producto con pricing
      return tx.product.findUnique({
        where: { id: product.id },
        include: { pricing: true },
      });
    });

    return mapToEntity(record);
  }

  /**
   * Busca producto por ID (UUID)
   */
  async findById(id: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { id },
      include: { pricing: true },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Busca producto por código (ej: "00001")
   */
  async findByCode(code: string): Promise<ProductEntity | null> {
    const record = await this.prisma.product.findUnique({
      where: { code },
      include: { pricing: true },
    });

    if (!record) {
      return null;
    }

    return mapToEntity(record);
  }

  /**
   * Lista todos los productos con pricing
   */
  async list(): Promise<ProductEntity[]> {
    const records = await this.prisma.product.findMany({
      include: { pricing: true },
      orderBy: { code: 'asc' },
    });

    return records.map(mapToEntity);
  }

  /**
   * Actualiza producto y/o pricing (transacción)
   */
  async update(id: string, data: UpdateProductInput): Promise<ProductEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      // Actualizar producto
      await tx.product.update({
        where: { id },
        data: {
          ...(data.brand !== undefined && { brand: data.brand }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.manufacturerCode !== undefined && { manufacturerCode: data.manufacturerCode }),
        },
      });

      // Actualizar o crear pricing si se proporciona
      if (data.pricing) {
        const existingPricing = await tx.productPricing.findUnique({
          where: { productId: id },
        });

        if (existingPricing) {
          // Actualizar pricing existente
          await tx.productPricing.update({
            where: { productId: id },
            data: {
              ...(data.pricing.publicPrice !== undefined && {
                publicPrice: toPrismaDecimal(data.pricing.publicPrice),
              }),
              ...(data.pricing.tradePrice !== undefined && {
                tradePrice: toPrismaDecimal(data.pricing.tradePrice),
              }),
              ...(data.pricing.wholesalePrice !== undefined && {
                wholesalePrice: toPrismaDecimal(data.pricing.wholesalePrice),
              }),
              ...(data.pricing.costPrice !== undefined && {
                costPrice: toPrismaDecimal(data.pricing.costPrice),
              }),
              ...(data.pricing.publicMarkup !== undefined && {
                publicMarkup: toPrismaDecimal(data.pricing.publicMarkup),
              }),
              ...(data.pricing.tradeMarkup !== undefined && {
                tradeMarkup: toPrismaDecimal(data.pricing.tradeMarkup),
              }),
              ...(data.pricing.wholesaleMarkup !== undefined && {
                wholesaleMarkup: toPrismaDecimal(data.pricing.wholesaleMarkup),
              }),
            },
          });
        } else {
          // Crear pricing nuevo
          await tx.productPricing.create({
            data: {
              productId: id,
              publicPrice: toPrismaDecimal(data.pricing.publicPrice ?? Decimal.zero()),
              tradePrice: toPrismaDecimal(data.pricing.tradePrice ?? Decimal.zero()),
              wholesalePrice: toPrismaDecimal(data.pricing.wholesalePrice ?? Decimal.zero()),
              costPrice: toPrismaDecimal(data.pricing.costPrice ?? Decimal.zero()),
              publicMarkup: toPrismaDecimal(data.pricing.publicMarkup ?? Decimal.zero()),
              tradeMarkup: toPrismaDecimal(data.pricing.tradeMarkup ?? Decimal.zero()),
              wholesaleMarkup: toPrismaDecimal(data.pricing.wholesaleMarkup ?? Decimal.zero()),
            },
          });
        }
      }

      // Retornar producto actualizado
      return tx.product.findUnique({
        where: { id },
        include: { pricing: true },
      });
    });

    return mapToEntity(record);
  }
}
