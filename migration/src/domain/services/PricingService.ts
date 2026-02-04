// =============================================================================
// PRICING SERVICE - Sistema HY
// =============================================================================
// Servicio de dominio para cálculo y resolución de precios
// Fuente legacy: fabrica.frm:706-716, frmremito.frm:509-515
// =============================================================================

import {
  Money,
  Percentage,
  PriceListType,
  ProductPricing,
  CustomerPriceContext,
  PriceCalculationResult,
  CustomerPriceResult,
} from '../types';

/**
 * Interfaz del servicio de precios
 * Permite inyección de dependencias y testing
 */
export interface IPricingService {
  /**
   * Calcula precio desde precio base aplicando markup
   * Fuente: fabrica.frm:706-716
   * Fórmula: precio = base + (base * markup / 100)
   */
  calculatePriceFromBase(
    basePrice: Money,
    markup: Percentage
  ): PriceCalculationResult;

  /**
   * Recalcula todos los precios de un producto desde el precio base
   * Fuente: fabrica.frm:706-716 (cmdcalcul_Click)
   */
  recalculateAllPrices(pricing: ProductPricing): ProductPricing;

  /**
   * Obtiene el precio correspondiente según la lista del cliente
   * Fuente: frmremito.frm:509-515
   */
  getPriceForCustomer(
    pricing: ProductPricing,
    customer: CustomerPriceContext
  ): CustomerPriceResult;

  /**
   * Calcula el markup inverso dado un precio base y precio final
   * Útil para importación de datos legacy
   */
  calculateMarkupFromPrices(
    basePrice: Money,
    finalPrice: Money
  ): Percentage;
}

/**
 * Utilidades para manipulación de Money
 */
export const MoneyUtils = {
  /**
   * Crea un objeto Money desde un número
   */
  fromNumber(amount: number, currency: 'ARS' = 'ARS'): Money {
    // Redondear a 2 decimales para evitar problemas de precisión
    const rounded = Math.round(amount * 100) / 100;
    return {
      amount: rounded.toFixed(2),
      currency,
    };
  },

  /**
   * Convierte Money a número para cálculos
   */
  toNumber(money: Money): number {
    return parseFloat(money.amount);
  },

  /**
   * Suma dos valores Money
   */
  add(a: Money, b: Money): Money {
    if (a.currency !== b.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return MoneyUtils.fromNumber(
      MoneyUtils.toNumber(a) + MoneyUtils.toNumber(b),
      a.currency
    );
  },

  /**
   * Multiplica Money por un factor
   */
  multiply(money: Money, factor: number): Money {
    return MoneyUtils.fromNumber(
      MoneyUtils.toNumber(money) * factor,
      money.currency
    );
  },

  /**
   * Crea Money con valor cero
   */
  zero(currency: 'ARS' = 'ARS'): Money {
    return { amount: '0.00', currency };
  },

  /**
   * Compara si dos Money son iguales
   */
  equals(a: Money, b: Money): boolean {
    return a.amount === b.amount && a.currency === b.currency;
  },
};

/**
 * Utilidades para manipulación de Percentage
 */
export const PercentageUtils = {
  /**
   * Crea un Percentage desde un número
   */
  fromNumber(value: number): Percentage {
    return { value };
  },

  /**
   * Convierte Percentage a factor multiplicador (0-1)
   */
  toFactor(percentage: Percentage): number {
    return percentage.value / 100;
  },
};

/**
 * Implementación del servicio de precios
 */
export class PricingService implements IPricingService {
  /**
   * Calcula precio desde precio base aplicando markup
   *
   * Lógica legacy (fabrica.frm:706-716):
   * ```vb
   * If txtmayorista.Text <> 0 Then
   *     txtl3.Text = txtl4.Text + (txtl4.Text * (txtmayorista / 100))
   * End If
   * ```
   *
   * Fórmula: precioFinal = precioBase + (precioBase * markup / 100)
   */
  calculatePriceFromBase(
    basePrice: Money,
    markup: Percentage
  ): PriceCalculationResult {
    const base = MoneyUtils.toNumber(basePrice);
    const markupFactor = PercentageUtils.toFactor(markup);

    // Fórmula del legacy: base + (base * markup / 100)
    const markupAmount = base * markupFactor;
    const finalPrice = base + markupAmount;

    return {
      basePrice,
      markup,
      calculatedPrice: MoneyUtils.fromNumber(finalPrice, basePrice.currency),
    };
  }

  /**
   * Recalcula todos los precios desde el precio base (costPrice/preciol4)
   *
   * Lógica legacy (fabrica.frm:706-716):
   * - preciol3 = preciol4 + (preciol4 * mayorista / 100)
   * - preciol2 = preciol4 + (preciol4 * gremio / 100)
   * - preciol1 = preciol4 + (preciol4 * publico / 100)
   */
  recalculateAllPrices(pricing: ProductPricing): ProductPricing {
    const { costPrice, publicMarkup, tradeMarkup, wholesaleMarkup } = pricing;

    // Calcular cada precio desde la base
    const publicResult = this.calculatePriceFromBase(costPrice, publicMarkup);
    const tradeResult = this.calculatePriceFromBase(costPrice, tradeMarkup);
    const wholesaleResult = this.calculatePriceFromBase(costPrice, wholesaleMarkup);

    return {
      ...pricing,
      publicPrice: publicResult.calculatedPrice,
      tradePrice: tradeResult.calculatedPrice,
      wholesalePrice: wholesaleResult.calculatedPrice,
    };
  }

  /**
   * Obtiene el precio según la lista asignada al cliente
   *
   * Lógica legacy (frmremito.frm:509-515):
   * ```vb
   * If lbllista.Caption = "Publico" Then
   *     Data1.Recordset!unitario = rArt!preciol1
   * ElseIf lbllista.Caption = "Gremio" Then
   *     Data1.Recordset!unitario = rArt!preciol2
   * ElseIf lbllista.Caption = "Mayorista" Then
   *     Data1.Recordset!unitario = rArt!preciol3
   * End If
   * ```
   */
  getPriceForCustomer(
    pricing: ProductPricing,
    customer: CustomerPriceContext
  ): CustomerPriceResult {
    let unitPrice: Money;

    switch (customer.priceList) {
      case PriceListType.PUBLICO:
        unitPrice = pricing.publicPrice;
        break;
      case PriceListType.GREMIO:
        unitPrice = pricing.tradePrice;
        break;
      case PriceListType.MAYORISTA:
        unitPrice = pricing.wholesalePrice;
        break;
      default:
        // Fallback a precio público (más alto) por seguridad
        unitPrice = pricing.publicPrice;
    }

    return {
      customerId: customer.customerId,
      productId: pricing.productId,
      priceList: customer.priceList,
      unitPrice,
    };
  }

  /**
   * Calcula el markup inverso dado precio base y precio final
   * Útil para migración de datos legacy donde solo hay precios finales
   *
   * Fórmula inversa: markup = ((final - base) / base) * 100
   */
  calculateMarkupFromPrices(basePrice: Money, finalPrice: Money): Percentage {
    const base = MoneyUtils.toNumber(basePrice);
    const final = MoneyUtils.toNumber(finalPrice);

    if (base === 0) {
      return PercentageUtils.fromNumber(0);
    }

    const markup = ((final - base) / base) * 100;

    // Redondear a 2 decimales
    const roundedMarkup = Math.round(markup * 100) / 100;

    return PercentageUtils.fromNumber(roundedMarkup);
  }
}

/**
 * Instancia singleton para uso general
 * Para testing, instanciar directamente PricingService
 */
export const pricingService = new PricingService();
