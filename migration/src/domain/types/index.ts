// =============================================================================
// TIPOS DE DOMINIO - Sistema HY
// =============================================================================
// Basado en modelo de dominio congelado
// =============================================================================

// Decimal type for safe monetary calculations
export { Decimal } from './decimal';

/**
 * Representa un valor monetario con precisión decimal
 * Evita problemas de punto flotante usando string internamente
 */
export interface Money {
  amount: string; // Decimal como string para precisión
  currency: 'ARS';
}

/**
 * Representa un porcentaje (0-100)
 */
export interface Percentage {
  value: number;
}

/**
 * Tipo de lista de precios
 * Fuente: frmremito.frm:509-515
 */
export enum PriceListType {
  PUBLICO = 'PUBLICO',
  GREMIO = 'GREMIO',
  MAYORISTA = 'MAYORISTA',
}

/**
 * Precios de un producto
 * Fuente: fabrica.frm:805-812
 */
export interface ProductPricing {
  productId: string;
  publicPrice: Money;      // preciol1
  tradePrice: Money;       // preciol2 (gremio)
  wholesalePrice: Money;   // preciol3 (mayorista)
  costPrice: Money;        // preciol4 (base)
  publicMarkup: Percentage;
  tradeMarkup: Percentage;
  wholesaleMarkup: Percentage;
}

/**
 * Datos mínimos de cliente para resolución de precio
 */
export interface CustomerPriceContext {
  customerId: string;
  priceList: PriceListType;
}

/**
 * Resultado del cálculo de precio
 */
export interface PriceCalculationResult {
  basePrice: Money;
  markup: Percentage;
  calculatedPrice: Money;
}

/**
 * Resultado de resolución de precio para cliente
 */
export interface CustomerPriceResult {
  customerId: string;
  productId: string;
  priceList: PriceListType;
  unitPrice: Money;
}
