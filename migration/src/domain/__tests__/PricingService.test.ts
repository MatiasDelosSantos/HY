// =============================================================================
// TESTS - PricingService
// =============================================================================
// Tests unitarios para el servicio de precios
// Validación contra lógica legacy de fabrica.frm y frmremito.frm
// =============================================================================

import {
  PricingService,
  MoneyUtils,
  PercentageUtils,
} from '../services/PricingService';
import {
  Money,
  Percentage,
  PriceListType,
  ProductPricing,
  CustomerPriceContext,
} from '../types';

describe('MoneyUtils', () => {
  describe('fromNumber', () => {
    it('should create Money from integer', () => {
      const money = MoneyUtils.fromNumber(100);
      expect(money).toEqual({ amount: '100.00', currency: 'ARS' });
    });

    it('should create Money from decimal', () => {
      const money = MoneyUtils.fromNumber(99.99);
      expect(money).toEqual({ amount: '99.99', currency: 'ARS' });
    });

    it('should round to 2 decimal places', () => {
      const money = MoneyUtils.fromNumber(99.999);
      expect(money).toEqual({ amount: '100.00', currency: 'ARS' });
    });

    it('should handle floating point precision issues', () => {
      // 0.1 + 0.2 = 0.30000000000000004 en JS
      const money = MoneyUtils.fromNumber(0.1 + 0.2);
      expect(money).toEqual({ amount: '0.30', currency: 'ARS' });
    });
  });

  describe('toNumber', () => {
    it('should convert Money to number', () => {
      const money: Money = { amount: '100.50', currency: 'ARS' };
      expect(MoneyUtils.toNumber(money)).toBe(100.5);
    });
  });

  describe('add', () => {
    it('should add two Money values', () => {
      const a = MoneyUtils.fromNumber(100);
      const b = MoneyUtils.fromNumber(50.50);
      const result = MoneyUtils.add(a, b);
      expect(result).toEqual({ amount: '150.50', currency: 'ARS' });
    });

    it('should throw error for different currencies', () => {
      const a: Money = { amount: '100.00', currency: 'ARS' };
      const b: Money = { amount: '50.00', currency: 'ARS' };
      // Simulamos otra moneda forzando el tipo
      (b as any).currency = 'USD';
      expect(() => MoneyUtils.add(a, b)).toThrow('Cannot add money with different currencies');
    });
  });

  describe('multiply', () => {
    it('should multiply Money by factor', () => {
      const money = MoneyUtils.fromNumber(100);
      const result = MoneyUtils.multiply(money, 1.21);
      expect(result).toEqual({ amount: '121.00', currency: 'ARS' });
    });
  });

  describe('equals', () => {
    it('should return true for equal Money', () => {
      const a = MoneyUtils.fromNumber(100);
      const b = MoneyUtils.fromNumber(100);
      expect(MoneyUtils.equals(a, b)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const a = MoneyUtils.fromNumber(100);
      const b = MoneyUtils.fromNumber(101);
      expect(MoneyUtils.equals(a, b)).toBe(false);
    });
  });
});

describe('PercentageUtils', () => {
  describe('fromNumber', () => {
    it('should create Percentage from number', () => {
      const percentage = PercentageUtils.fromNumber(21);
      expect(percentage).toEqual({ value: 21 });
    });
  });

  describe('toFactor', () => {
    it('should convert 100% to factor 1', () => {
      const percentage: Percentage = { value: 100 };
      expect(PercentageUtils.toFactor(percentage)).toBe(1);
    });

    it('should convert 50% to factor 0.5', () => {
      const percentage: Percentage = { value: 50 };
      expect(PercentageUtils.toFactor(percentage)).toBe(0.5);
    });

    it('should convert 21% to factor 0.21', () => {
      const percentage: Percentage = { value: 21 };
      expect(PercentageUtils.toFactor(percentage)).toBe(0.21);
    });
  });
});

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(() => {
    service = new PricingService();
  });

  describe('calculatePriceFromBase', () => {
    /**
     * Test basado en lógica legacy:
     * fabrica.frm:714 - txtl1.Text = txtl4.Text + (txtl4.Text * (txtPublico.Text / 100))
     */
    it('should calculate price with markup (legacy formula)', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const markup = PercentageUtils.fromNumber(50);

      const result = service.calculatePriceFromBase(basePrice, markup);

      // 100 + (100 * 50 / 100) = 100 + 50 = 150
      expect(result.calculatedPrice).toEqual({ amount: '150.00', currency: 'ARS' });
      expect(result.basePrice).toEqual(basePrice);
      expect(result.markup).toEqual(markup);
    });

    it('should handle zero markup', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const markup = PercentageUtils.fromNumber(0);

      const result = service.calculatePriceFromBase(basePrice, markup);

      expect(result.calculatedPrice).toEqual({ amount: '100.00', currency: 'ARS' });
    });

    it('should handle decimal markup (21% IVA case)', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const markup = PercentageUtils.fromNumber(21);

      const result = service.calculatePriceFromBase(basePrice, markup);

      // 100 + (100 * 21 / 100) = 100 + 21 = 121
      expect(result.calculatedPrice).toEqual({ amount: '121.00', currency: 'ARS' });
    });

    it('should handle real-world pricing scenario', () => {
      // Precio base: $1500, markup público: 35%
      const basePrice = MoneyUtils.fromNumber(1500);
      const markup = PercentageUtils.fromNumber(35);

      const result = service.calculatePriceFromBase(basePrice, markup);

      // 1500 + (1500 * 35 / 100) = 1500 + 525 = 2025
      expect(result.calculatedPrice).toEqual({ amount: '2025.00', currency: 'ARS' });
    });

    it('should handle decimal prices correctly', () => {
      const basePrice = MoneyUtils.fromNumber(99.99);
      const markup = PercentageUtils.fromNumber(10);

      const result = service.calculatePriceFromBase(basePrice, markup);

      // 99.99 + (99.99 * 10 / 100) = 99.99 + 9.999 = 109.989 -> 109.99
      expect(result.calculatedPrice).toEqual({ amount: '109.99', currency: 'ARS' });
    });
  });

  describe('recalculateAllPrices', () => {
    /**
     * Test basado en lógica legacy de fabrica.frm:706-716 (cmdcalcul_Click)
     */
    it('should recalculate all prices from cost price', () => {
      const pricing: ProductPricing = {
        productId: 'test-product-1',
        costPrice: MoneyUtils.fromNumber(1000),        // preciol4 (base)
        publicPrice: MoneyUtils.fromNumber(0),         // preciol1 (será calculado)
        tradePrice: MoneyUtils.fromNumber(0),          // preciol2 (será calculado)
        wholesalePrice: MoneyUtils.fromNumber(0),      // preciol3 (será calculado)
        publicMarkup: PercentageUtils.fromNumber(50),  // 50% markup público
        tradeMarkup: PercentageUtils.fromNumber(30),   // 30% markup gremio
        wholesaleMarkup: PercentageUtils.fromNumber(15), // 15% markup mayorista
      };

      const result = service.recalculateAllPrices(pricing);

      // preciol1 = 1000 + (1000 * 50/100) = 1500
      expect(result.publicPrice).toEqual({ amount: '1500.00', currency: 'ARS' });

      // preciol2 = 1000 + (1000 * 30/100) = 1300
      expect(result.tradePrice).toEqual({ amount: '1300.00', currency: 'ARS' });

      // preciol3 = 1000 + (1000 * 15/100) = 1150
      expect(result.wholesalePrice).toEqual({ amount: '1150.00', currency: 'ARS' });

      // El precio base no cambia
      expect(result.costPrice).toEqual({ amount: '1000.00', currency: 'ARS' });
    });

    it('should preserve productId and markups', () => {
      const pricing: ProductPricing = {
        productId: 'preserve-test',
        costPrice: MoneyUtils.fromNumber(500),
        publicPrice: MoneyUtils.fromNumber(0),
        tradePrice: MoneyUtils.fromNumber(0),
        wholesalePrice: MoneyUtils.fromNumber(0),
        publicMarkup: PercentageUtils.fromNumber(40),
        tradeMarkup: PercentageUtils.fromNumber(25),
        wholesaleMarkup: PercentageUtils.fromNumber(10),
      };

      const result = service.recalculateAllPrices(pricing);

      expect(result.productId).toBe('preserve-test');
      expect(result.publicMarkup).toEqual({ value: 40 });
      expect(result.tradeMarkup).toEqual({ value: 25 });
      expect(result.wholesaleMarkup).toEqual({ value: 10 });
    });
  });

  describe('getPriceForCustomer', () => {
    const testPricing: ProductPricing = {
      productId: 'prod-001',
      costPrice: MoneyUtils.fromNumber(1000),
      publicPrice: MoneyUtils.fromNumber(1500),     // preciol1
      tradePrice: MoneyUtils.fromNumber(1300),      // preciol2
      wholesalePrice: MoneyUtils.fromNumber(1150),  // preciol3
      publicMarkup: PercentageUtils.fromNumber(50),
      tradeMarkup: PercentageUtils.fromNumber(30),
      wholesaleMarkup: PercentageUtils.fromNumber(15),
    };

    /**
     * Test basado en lógica legacy de frmremito.frm:509-511
     * If lbllista.Caption = "Publico" Then Data1.Recordset!unitario = rArt!preciol1
     */
    it('should return public price for PUBLICO list', () => {
      const customer: CustomerPriceContext = {
        customerId: 'cust-001',
        priceList: PriceListType.PUBLICO,
      };

      const result = service.getPriceForCustomer(testPricing, customer);

      expect(result.unitPrice).toEqual({ amount: '1500.00', currency: 'ARS' });
      expect(result.priceList).toBe(PriceListType.PUBLICO);
      expect(result.customerId).toBe('cust-001');
      expect(result.productId).toBe('prod-001');
    });

    /**
     * Test basado en lógica legacy de frmremito.frm:511-512
     * ElseIf lbllista.Caption = "Gremio" Then Data1.Recordset!unitario = rArt!preciol2
     */
    it('should return trade price for GREMIO list', () => {
      const customer: CustomerPriceContext = {
        customerId: 'cust-002',
        priceList: PriceListType.GREMIO,
      };

      const result = service.getPriceForCustomer(testPricing, customer);

      expect(result.unitPrice).toEqual({ amount: '1300.00', currency: 'ARS' });
      expect(result.priceList).toBe(PriceListType.GREMIO);
    });

    /**
     * Test basado en lógica legacy de frmremito.frm:513-514
     * ElseIf lbllista.Caption = "Mayorista" Then Data1.Recordset!unitario = rArt!preciol3
     */
    it('should return wholesale price for MAYORISTA list', () => {
      const customer: CustomerPriceContext = {
        customerId: 'cust-003',
        priceList: PriceListType.MAYORISTA,
      };

      const result = service.getPriceForCustomer(testPricing, customer);

      expect(result.unitPrice).toEqual({ amount: '1150.00', currency: 'ARS' });
      expect(result.priceList).toBe(PriceListType.MAYORISTA);
    });
  });

  describe('calculateMarkupFromPrices', () => {
    it('should calculate markup from base and final price', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const finalPrice = MoneyUtils.fromNumber(150);

      const markup = service.calculateMarkupFromPrices(basePrice, finalPrice);

      // (150 - 100) / 100 * 100 = 50%
      expect(markup).toEqual({ value: 50 });
    });

    it('should handle zero base price', () => {
      const basePrice = MoneyUtils.fromNumber(0);
      const finalPrice = MoneyUtils.fromNumber(100);

      const markup = service.calculateMarkupFromPrices(basePrice, finalPrice);

      expect(markup).toEqual({ value: 0 });
    });

    it('should handle same base and final price (0% markup)', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const finalPrice = MoneyUtils.fromNumber(100);

      const markup = service.calculateMarkupFromPrices(basePrice, finalPrice);

      expect(markup).toEqual({ value: 0 });
    });

    it('should handle decimal markup results', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const finalPrice = MoneyUtils.fromNumber(121);

      const markup = service.calculateMarkupFromPrices(basePrice, finalPrice);

      expect(markup).toEqual({ value: 21 });
    });

    it('should round to 2 decimal places', () => {
      const basePrice = MoneyUtils.fromNumber(100);
      const finalPrice = MoneyUtils.fromNumber(133.33);

      const markup = service.calculateMarkupFromPrices(basePrice, finalPrice);

      // 33.33%
      expect(markup).toEqual({ value: 33.33 });
    });

    it('should be inverse of calculatePriceFromBase', () => {
      const basePrice = MoneyUtils.fromNumber(1000);
      const originalMarkup = PercentageUtils.fromNumber(35);

      // Calcular precio final
      const priceResult = service.calculatePriceFromBase(basePrice, originalMarkup);

      // Calcular markup inverso
      const calculatedMarkup = service.calculateMarkupFromPrices(
        basePrice,
        priceResult.calculatedPrice
      );

      expect(calculatedMarkup.value).toBe(originalMarkup.value);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete product pricing workflow', () => {
      // 1. Definir producto con precio base y markups
      const initialPricing: ProductPricing = {
        productId: 'cerradura-001',
        costPrice: MoneyUtils.fromNumber(2500),      // Costo: $2500
        publicPrice: MoneyUtils.fromNumber(0),
        tradePrice: MoneyUtils.fromNumber(0),
        wholesalePrice: MoneyUtils.fromNumber(0),
        publicMarkup: PercentageUtils.fromNumber(60),   // +60% para público
        tradeMarkup: PercentageUtils.fromNumber(40),    // +40% para gremio
        wholesaleMarkup: PercentageUtils.fromNumber(20), // +20% para mayorista
      };

      // 2. Recalcular precios
      const pricing = service.recalculateAllPrices(initialPricing);

      // Verificar precios calculados
      expect(pricing.publicPrice).toEqual({ amount: '4000.00', currency: 'ARS' });    // 2500 * 1.6
      expect(pricing.tradePrice).toEqual({ amount: '3500.00', currency: 'ARS' });     // 2500 * 1.4
      expect(pricing.wholesalePrice).toEqual({ amount: '3000.00', currency: 'ARS' }); // 2500 * 1.2

      // 3. Obtener precio para diferentes tipos de cliente
      const publicCustomer: CustomerPriceContext = {
        customerId: 'cli-pub-001',
        priceList: PriceListType.PUBLICO,
      };
      const tradeCustomer: CustomerPriceContext = {
        customerId: 'cli-gre-001',
        priceList: PriceListType.GREMIO,
      };
      const wholesaleCustomer: CustomerPriceContext = {
        customerId: 'cli-may-001',
        priceList: PriceListType.MAYORISTA,
      };

      const publicResult = service.getPriceForCustomer(pricing, publicCustomer);
      const tradeResult = service.getPriceForCustomer(pricing, tradeCustomer);
      const wholesaleResult = service.getPriceForCustomer(pricing, wholesaleCustomer);

      expect(publicResult.unitPrice.amount).toBe('4000.00');
      expect(tradeResult.unitPrice.amount).toBe('3500.00');
      expect(wholesaleResult.unitPrice.amount).toBe('3000.00');
    });

    it('should match legacy VB6 calculation exactly', () => {
      /**
       * Simulación exacta del código legacy:
       * fabrica.frm:706-716
       *
       * txtl4.Text = 1000 (precio base)
       * txtmayorista.Text = 15 (15% markup)
       * txtgremio.Text = 30
       * txtPublico.Text = 50
       *
       * Resultado esperado:
       * txtl3 = 1000 + (1000 * 15/100) = 1150
       * txtl2 = 1000 + (1000 * 30/100) = 1300
       * txtl1 = 1000 + (1000 * 50/100) = 1500
       */
      const basePrice = MoneyUtils.fromNumber(1000);

      const l3Result = service.calculatePriceFromBase(basePrice, { value: 15 });
      const l2Result = service.calculatePriceFromBase(basePrice, { value: 30 });
      const l1Result = service.calculatePriceFromBase(basePrice, { value: 50 });

      expect(l3Result.calculatedPrice.amount).toBe('1150.00'); // txtl3
      expect(l2Result.calculatedPrice.amount).toBe('1300.00'); // txtl2
      expect(l1Result.calculatedPrice.amount).toBe('1500.00'); // txtl1
    });
  });
});
