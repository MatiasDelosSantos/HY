// =============================================================================
// REPOSITORY TYPES
// =============================================================================
// Tipos para entrada/salida de repositorios
// =============================================================================

import { Decimal } from '../../domain/types/decimal';
import { InvoiceStatus } from '../../domain/services/PaymentService';

// =============================================================================
// CUSTOMER
// =============================================================================

export type TaxStatus =
  | 'RESPONSABLE_INSCRIPTO'
  | 'RESPONSABLE_NO_INSCRIPTO'
  | 'MONOTRIBUTO'
  | 'CONSUMIDOR_FINAL'
  | 'EXENTO';

export type InvoiceLetterType = 'A' | 'B' | 'C';

export type PriceListType = 'PUBLICO' | 'GREMIO' | 'MAYORISTA';

export interface CustomerEntity {
  id: string;
  code: string;
  businessName: string;
  address: string | null;
  taxId: string | null;
  phone: string | null;
  taxStatus: TaxStatus | null;
  invoiceType: InvoiceLetterType | null;
  priceList: PriceListType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerInput {
  code: string;
  businessName: string;
  address?: string | null;
  taxId?: string | null;
  phone?: string | null;
  taxStatus?: TaxStatus | null;
  invoiceType?: InvoiceLetterType | null;
  priceList?: PriceListType;
}

export interface UpdateCustomerInput {
  businessName?: string;
  address?: string | null;
  taxId?: string | null;
  phone?: string | null;
  taxStatus?: TaxStatus | null;
  invoiceType?: InvoiceLetterType | null;
  priceList?: PriceListType;
}

// =============================================================================
// PRODUCT
// =============================================================================

export interface ProductPricingEntity {
  id: string;
  productId: string;
  publicPrice: Decimal;
  tradePrice: Decimal;
  wholesalePrice: Decimal;
  costPrice: Decimal;
  publicMarkup: Decimal;
  tradeMarkup: Decimal;
  wholesaleMarkup: Decimal;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductEntity {
  id: string;
  code: string;
  brand: string | null;
  description: string;
  manufacturerCode: string | null;
  pricing: ProductPricingEntity | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductPricingInput {
  publicPrice?: Decimal;
  tradePrice?: Decimal;
  wholesalePrice?: Decimal;
  costPrice?: Decimal;
  publicMarkup?: Decimal;
  tradeMarkup?: Decimal;
  wholesaleMarkup?: Decimal;
}

export interface CreateProductInput {
  code: string;
  brand?: string | null;
  description: string;
  manufacturerCode?: string | null;
  pricing?: CreateProductPricingInput;
}

export interface UpdateProductInput {
  brand?: string | null;
  description?: string;
  manufacturerCode?: string | null;
  pricing?: CreateProductPricingInput;
}

// =============================================================================
// INVOICE
// =============================================================================

export type DocumentType = 'SALE' | 'RECEIPT' | 'CREDIT_NOTE';

export interface InvoiceItemEntity {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: Decimal;
  unitPrice: Decimal;
  discount: Decimal;
  total: Decimal;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceEntity {
  id: string;
  type: DocumentType;
  number: string;
  date: Date;
  dueDate: Date | null;
  customerId: string;
  status: InvoiceStatus;
  subtotal: Decimal;
  discount: Decimal;
  tax21: Decimal;
  total: Decimal;
  balance: Decimal;
  relatedInvoiceId: string | null;
  items: InvoiceItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceItemInput {
  productId: string;
  quantity: Decimal;
  unitPrice: Decimal;
  discount?: Decimal;
  total: Decimal;
}

export interface CreateInvoiceInput {
  type?: DocumentType;
  number: string;
  date: Date;
  dueDate?: Date | null;
  customerId: string;
  status?: InvoiceStatus;
  subtotal: Decimal;
  discount?: Decimal;
  tax21: Decimal;
  total: Decimal;
  balance: Decimal;
  relatedInvoiceId?: string | null;
  items: CreateInvoiceItemInput[];
}

// =============================================================================
// PAYMENT
// =============================================================================

export interface PaymentAllocationEntity {
  id: string;
  paymentId: string;
  invoiceId: string;
  amount: Decimal;
  createdAt: Date;
}

export interface PaymentEntity {
  id: string;
  receiptNumber: string;
  date: Date;
  customerId: string;
  amount: Decimal;
  paymentType: string | null;
  allocations: PaymentAllocationEntity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentAllocationInput {
  invoiceId: string;
  amount: Decimal;
}

export interface CreatePaymentInput {
  receiptNumber: string;
  date: Date;
  customerId: string;
  amount: Decimal;
  paymentType?: string | null;
  allocations: CreatePaymentAllocationInput[];
}
