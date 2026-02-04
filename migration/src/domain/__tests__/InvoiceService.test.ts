// =============================================================================
// TESTS - InvoiceService
// =============================================================================
// Tests unitarios para el servicio de cálculo de facturas
// Validación contra lógica legacy de frmremito.frm
// =============================================================================

import { InvoiceService, InvoiceCalculationInput } from '../services/InvoiceService';
import { Decimal } from '../types/decimal';

describe('Decimal', () => {
  describe('basic operations', () => {
    it('should create from number', () => {
      const d = Decimal.fromNumber(100.50);
      expect(d.toString()).toBe('100.50');
    });

    it('should create from string', () => {
      const d = Decimal.fromString('99.99');
      expect(d.toString()).toBe('99.99');
    });

    it('should handle floating point precision', () => {
      // 0.1 + 0.2 should equal 0.3, not 0.30000000000000004
      const a = Decimal.fromNumber(0.1);
      const b = Decimal.fromNumber(0.2);
      const result = a.add(b);
      expect(result.toString()).toBe('0.30');
    });

    it('should add correctly', () => {
      const a = Decimal.fromNumber(100.50);
      const b = Decimal.fromNumber(50.25);
      expect(a.add(b).toString()).toBe('150.75');
    });

    it('should subtract correctly', () => {
      const a = Decimal.fromNumber(100.00);
      const b = Decimal.fromNumber(30.50);
      expect(a.subtract(b).toString()).toBe('69.50');
    });

    it('should multiply correctly', () => {
      const a = Decimal.fromNumber(10);
      const b = Decimal.fromNumber(5.5);
      expect(a.multiply(b).toString()).toBe('55.00');
    });

    it('should calculate percentage correctly', () => {
      const base = Decimal.fromNumber(1000);
      const percent = Decimal.fromNumber(21);
      // 1000 * 21 / 100 = 210
      expect(base.percentage(percent).toString()).toBe('210.00');
    });
  });
});

describe('InvoiceService', () => {
  let service: InvoiceService;
  const testDate = new Date('2024-01-15');

  beforeEach(() => {
    service = new InvoiceService();
  });

  describe('calculateItem', () => {
    /**
     * Test basado en lógica legacy:
     * frmremito.frm:565 - total = unitario * cantidad
     */
    it('should calculate item without discount', () => {
      const result = service.calculateItem({
        quantity: Decimal.fromNumber(5),
        unitPrice: Decimal.fromNumber(100),
      });

      expect(result.lineSubtotal.toString()).toBe('500.00');
      expect(result.lineDiscount.toString()).toBe('0.00');
      expect(result.lineTotal.toString()).toBe('500.00');
    });

    /**
     * Test basado en lógica legacy:
     * frmremito.frm:617-618 - vBonif = total * (bonif / 100)
     */
    it('should calculate item with discount', () => {
      const result = service.calculateItem({
        quantity: Decimal.fromNumber(10),
        unitPrice: Decimal.fromNumber(50),
        discountPercent: Decimal.fromNumber(10), // 10%
      });

      // lineSubtotal = 10 * 50 = 500
      expect(result.lineSubtotal.toString()).toBe('500.00');
      // lineDiscount = 500 * 10 / 100 = 50
      expect(result.lineDiscount.toString()).toBe('50.00');
      // lineTotal = 500 - 50 = 450
      expect(result.lineTotal.toString()).toBe('450.00');
    });

    it('should handle decimal quantities', () => {
      const result = service.calculateItem({
        quantity: Decimal.fromNumber(2.5),
        unitPrice: Decimal.fromNumber(40),
      });

      // 2.5 * 40 = 100
      expect(result.lineTotal.toString()).toBe('100.00');
    });

    it('should handle decimal prices', () => {
      const result = service.calculateItem({
        quantity: Decimal.fromNumber(3),
        unitPrice: Decimal.fromNumber(33.33),
      });

      // 3 * 33.33 = 99.99
      expect(result.lineTotal.toString()).toBe('99.99');
    });
  });

  describe('calculateInvoice - simple invoice without discounts', () => {
    /**
     * Factura simple sin descuentos
     * Valida flujo básico de frmremito.frm:578-612
     */
    it('should calculate invoice with single item', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(1000) },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // subtotal = 1000
      expect(result.subtotal.toString()).toBe('1000.00');
      // tax21 = 1000 * 0.21 = 210
      expect(result.tax21.toString()).toBe('210.00');
      // total = 1000 + 210 = 1210
      expect(result.total.toString()).toBe('1210.00');
      // balance = total
      expect(result.balance.toString()).toBe('1210.00');
      // no discounts
      expect(result.discountTotal.toString()).toBe('0.00');
    });

    it('should calculate invoice with multiple items', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(2), unitPrice: Decimal.fromNumber(500) },  // 1000
          { quantity: Decimal.fromNumber(5), unitPrice: Decimal.fromNumber(200) },  // 1000
          { quantity: Decimal.fromNumber(10), unitPrice: Decimal.fromNumber(50) },  // 500
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // subtotal = 1000 + 1000 + 500 = 2500
      expect(result.subtotal.toString()).toBe('2500.00');
      // tax21 = 2500 * 0.21 = 525
      expect(result.tax21.toString()).toBe('525.00');
      // total = 2500 + 525 = 3025
      expect(result.total.toString()).toBe('3025.00');
    });
  });

  describe('calculateInvoice - with item discounts', () => {
    /**
     * Factura con descuentos por ítem
     * Fuente: frmremito.frm:617-618
     */
    it('should apply item-level discounts', () => {
      const input: InvoiceCalculationInput = {
        items: [
          {
            quantity: Decimal.fromNumber(10),
            unitPrice: Decimal.fromNumber(100),
            discountPercent: Decimal.fromNumber(10), // 10% off
          },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // lineSubtotal = 10 * 100 = 1000
      // lineDiscount = 1000 * 10% = 100
      // lineTotal = 1000 - 100 = 900
      expect(result.subtotal.toString()).toBe('900.00');
      expect(result.itemDiscountTotal.toString()).toBe('100.00');
      // tax21 = 900 * 0.21 = 189
      expect(result.tax21.toString()).toBe('189.00');
      // total = 900 + 189 = 1089
      expect(result.total.toString()).toBe('1089.00');
    });

    it('should accumulate discounts from multiple items', () => {
      const input: InvoiceCalculationInput = {
        items: [
          {
            quantity: Decimal.fromNumber(5),
            unitPrice: Decimal.fromNumber(200),
            discountPercent: Decimal.fromNumber(10), // 10% = 100 off 1000
          },
          {
            quantity: Decimal.fromNumber(2),
            unitPrice: Decimal.fromNumber(500),
            discountPercent: Decimal.fromNumber(20), // 20% = 200 off 1000
          },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // Item 1: 5 * 200 = 1000, discount 100, net 900
      // Item 2: 2 * 500 = 1000, discount 200, net 800
      // subtotal = 900 + 800 = 1700
      expect(result.subtotal.toString()).toBe('1700.00');
      // itemDiscountTotal = 100 + 200 = 300
      expect(result.itemDiscountTotal.toString()).toBe('300.00');
      // tax21 = 1700 * 0.21 = 357
      expect(result.tax21.toString()).toBe('357.00');
      // total = 1700 + 357 = 2057
      expect(result.total.toString()).toBe('2057.00');
    });
  });

  describe('calculateInvoice - with general discount (bonificación)', () => {
    /**
     * Factura con bonificación general
     * Fuente: frmremito.frm:598 - vSubtotal = vSubtotal - vBonif
     */
    it('should apply invoice-level discount', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(1000) },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(10), // 10% bonificación
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // subtotal = 1000
      expect(result.subtotal.toString()).toBe('1000.00');
      // invoiceDiscount = 1000 * 10% = 100
      expect(result.invoiceDiscount.toString()).toBe('100.00');
      // taxableBase = 1000 - 100 = 900
      expect(result.taxableBase.toString()).toBe('900.00');
      // tax21 = 900 * 0.21 = 189
      expect(result.tax21.toString()).toBe('189.00');
      // total = 900 + 189 = 1089
      expect(result.total.toString()).toBe('1089.00');
    });

    it('should calculate discountTotal including invoice discount', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(2000) },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(5),
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // invoiceDiscount = 2000 * 5% = 100
      expect(result.invoiceDiscount.toString()).toBe('100.00');
      // discountTotal = 0 (item) + 100 (invoice) = 100
      expect(result.discountTotal.toString()).toBe('100.00');
    });
  });

  describe('calculateInvoice - combination of discounts', () => {
    /**
     * Combinación de descuentos por ítem y bonificación general
     */
    it('should apply both item and invoice discounts', () => {
      const input: InvoiceCalculationInput = {
        items: [
          {
            quantity: Decimal.fromNumber(10),
            unitPrice: Decimal.fromNumber(100),
            discountPercent: Decimal.fromNumber(10), // 10% item discount
          },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(5), // 5% invoice discount
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // lineSubtotal = 10 * 100 = 1000
      // itemDiscount = 1000 * 10% = 100
      // subtotal (after item discount) = 900
      expect(result.subtotal.toString()).toBe('900.00');
      expect(result.itemDiscountTotal.toString()).toBe('100.00');

      // invoiceDiscount = 900 * 5% = 45
      expect(result.invoiceDiscount.toString()).toBe('45.00');

      // discountTotal = 100 + 45 = 145
      expect(result.discountTotal.toString()).toBe('145.00');

      // taxableBase = 900 - 45 = 855
      expect(result.taxableBase.toString()).toBe('855.00');

      // tax21 = 855 * 0.21 = 179.55
      expect(result.tax21.toString()).toBe('179.55');

      // total = 855 + 179.55 = 1034.55
      expect(result.total.toString()).toBe('1034.55');
    });

    it('should handle complex scenario with multiple items and discounts', () => {
      const input: InvoiceCalculationInput = {
        items: [
          {
            quantity: Decimal.fromNumber(3),
            unitPrice: Decimal.fromNumber(150),
            discountPercent: Decimal.fromNumber(5),
          },
          {
            quantity: Decimal.fromNumber(2),
            unitPrice: Decimal.fromNumber(250),
          },
          {
            quantity: Decimal.fromNumber(1),
            unitPrice: Decimal.fromNumber(500),
            discountPercent: Decimal.fromNumber(15),
          },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(3),
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // Item 1: 3 * 150 = 450, 5% off = 22.50, net = 427.50
      // Item 2: 2 * 250 = 500, no discount, net = 500
      // Item 3: 1 * 500 = 500, 15% off = 75, net = 425
      // subtotal = 427.50 + 500 + 425 = 1352.50
      expect(result.subtotal.toString()).toBe('1352.50');

      // itemDiscountTotal = 22.50 + 0 + 75 = 97.50
      expect(result.itemDiscountTotal.toString()).toBe('97.50');

      // invoiceDiscount = 1352.50 * 3% = 40.575 -> 40.58
      expect(result.invoiceDiscount.toString()).toBe('40.58');

      // taxableBase = 1352.50 - 40.58 = 1311.92
      expect(result.taxableBase.toString()).toBe('1311.92');

      // tax21 = 1311.92 * 0.21 = 275.5032 -> 275.50
      expect(result.tax21.toString()).toBe('275.50');

      // total = 1311.92 + 275.50 = 1587.42
      expect(result.total.toString()).toBe('1587.42');
    });
  });

  describe('calculateInvoice - IVA 21% precision', () => {
    /**
     * IVA 21% exacto a 2 decimales
     * Fuente: frmremito.frm:599 - vIva21 = (vSubtotal * 0.21)
     */
    it('should calculate IVA 21% with exact precision', () => {
      const testCases = [
        { subtotal: 100, expectedTax: '21.00' },
        { subtotal: 1000, expectedTax: '210.00' },
        { subtotal: 123.45, expectedTax: '25.92' }, // 123.45 * 0.21 = 25.9245
        { subtotal: 999.99, expectedTax: '210.00' }, // 999.99 * 0.21 = 209.9979
        { subtotal: 1.00, expectedTax: '0.21' },
      ];

      for (const { subtotal, expectedTax } of testCases) {
        const input: InvoiceCalculationInput = {
          items: [
            { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(subtotal) },
          ],
          issueDate: testDate,
        };

        const result = service.calculateInvoice(input);
        expect(result.tax21.toString()).toBe(expectedTax);
      }
    });

    it('should use custom tax rate when provided', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(1000) },
        ],
        taxRate: 0.105, // 10.5% IVA reducido (número, no Decimal)
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      // tax = 1000 * 0.105 = 105
      expect(result.tax21.toString()).toBe('105.00');
      // total = 1000 + 105 = 1105
      expect(result.total.toString()).toBe('1105.00');
    });
  });

  describe('calculateInvoice - dates', () => {
    /**
     * Fecha de vencimiento = fecha + 30 días
     * Fuente: frmremito.frm:732
     */
    it('should set dueDate 30 days after issueDate', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(100) },
        ],
        issueDate: new Date('2024-01-15'),
      };

      const result = service.calculateInvoice(input);

      expect(result.issueDate).toEqual(new Date('2024-01-15'));
      expect(result.dueDate).toEqual(new Date('2024-02-14'));
    });

    it('should handle month boundary correctly', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(1), unitPrice: Decimal.fromNumber(100) },
        ],
        issueDate: new Date('2024-01-31'),
      };

      const result = service.calculateInvoice(input);

      // 31 de enero + 30 días = 1 de marzo (2024 es bisiesto)
      expect(result.dueDate).toEqual(new Date('2024-03-01'));
    });
  });

  describe('calculateInvoice - balance', () => {
    /**
     * Balance inicial = total
     * Fuente: frmremito.frm:730
     */
    it('should set balance equal to total', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(5), unitPrice: Decimal.fromNumber(200) },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(10),
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      expect(result.balance.equals(result.total)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty items array', () => {
      const input: InvoiceCalculationInput = {
        items: [],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      expect(result.subtotal.toString()).toBe('0.00');
      expect(result.tax21.toString()).toBe('0.00');
      expect(result.total.toString()).toBe('0.00');
    });

    it('should handle zero quantity', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(0), unitPrice: Decimal.fromNumber(100) },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      expect(result.subtotal.toString()).toBe('0.00');
      expect(result.total.toString()).toBe('0.00');
    });

    it('should handle zero price', () => {
      const input: InvoiceCalculationInput = {
        items: [
          { quantity: Decimal.fromNumber(10), unitPrice: Decimal.fromNumber(0) },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      expect(result.subtotal.toString()).toBe('0.00');
    });

    it('should handle 100% item discount', () => {
      const input: InvoiceCalculationInput = {
        items: [
          {
            quantity: Decimal.fromNumber(1),
            unitPrice: Decimal.fromNumber(1000),
            discountPercent: Decimal.fromNumber(100),
          },
        ],
        issueDate: testDate,
      };

      const result = service.calculateInvoice(input);

      expect(result.subtotal.toString()).toBe('0.00');
      expect(result.itemDiscountTotal.toString()).toBe('1000.00');
      expect(result.total.toString()).toBe('0.00');
    });
  });

  describe('legacy VB6 calculation match', () => {
    /**
     * Simulación exacta del flujo legacy
     * Reproduce frmremito.frm:578-612 con datos conocidos
     */
    it('should match legacy calculation exactly', () => {
      // Escenario: Cliente compra varios productos con bonificación
      const input: InvoiceCalculationInput = {
        items: [
          // Cerradura x 2 @ $500 = $1000
          { quantity: Decimal.fromNumber(2), unitPrice: Decimal.fromNumber(500) },
          // Picaportes x 5 @ $150 = $750, 10% desc = $675
          {
            quantity: Decimal.fromNumber(5),
            unitPrice: Decimal.fromNumber(150),
            discountPercent: Decimal.fromNumber(10),
          },
          // Bisagras x 20 @ $25 = $500
          { quantity: Decimal.fromNumber(20), unitPrice: Decimal.fromNumber(25) },
        ],
        invoiceDiscountPercent: Decimal.fromNumber(5), // 5% bonificación general
        issueDate: new Date('2024-06-15'),
      };

      const result = service.calculateInvoice(input);

      // Cálculo manual:
      // Item 1: 2 * 500 = 1000, no desc, net = 1000
      // Item 2: 5 * 150 = 750, 10% = 75, net = 675
      // Item 3: 20 * 25 = 500, no desc, net = 500
      // subtotal = 1000 + 675 + 500 = 2175

      expect(result.items.length).toBe(3);
      expect(result.subtotal.toString()).toBe('2175.00');
      expect(result.itemDiscountTotal.toString()).toBe('75.00');

      // invoiceDiscount = 2175 * 5% = 108.75
      expect(result.invoiceDiscount.toString()).toBe('108.75');

      // taxableBase = 2175 - 108.75 = 2066.25
      expect(result.taxableBase.toString()).toBe('2066.25');

      // tax21 = 2066.25 * 0.21 = 433.9125 -> 433.91
      expect(result.tax21.toString()).toBe('433.91');

      // total = 2066.25 + 433.91 = 2500.16
      expect(result.total.toString()).toBe('2500.16');

      // balance = total
      expect(result.balance.toString()).toBe('2500.16');

      // dueDate = 2024-06-15 + 30 = 2024-07-15
      expect(result.dueDate).toEqual(new Date('2024-07-15'));
    });
  });
});
