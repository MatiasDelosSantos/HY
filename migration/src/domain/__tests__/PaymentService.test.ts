// =============================================================================
// TESTS - PaymentService
// =============================================================================
// Tests unitarios para el servicio de cobranzas
// Validación contra lógica legacy de frmcobranza.frm
// =============================================================================

import {
  PaymentService,
  ProcessPaymentInput,
  PendingInvoice,
  InvoiceStatus,
} from '../services/PaymentService';
import { Decimal } from '../types/decimal';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    service = new PaymentService();
  });

  // Helper para crear facturas de prueba
  const createInvoice = (
    id: string,
    number: string,
    date: Date,
    total: number,
    balance: number,
    status: InvoiceStatus = InvoiceStatus.PENDING
  ): PendingInvoice => ({
    id,
    number,
    date,
    total: Decimal.fromNumber(total),
    balance: Decimal.fromNumber(balance),
    status,
  });

  describe('sortInvoicesByDate', () => {
    it('should sort invoices by date ascending (FIFO)', () => {
      const invoices = [
        createInvoice('3', 'FAC-003', new Date('2024-03-15'), 300, 300),
        createInvoice('1', 'FAC-001', new Date('2024-01-10'), 100, 100),
        createInvoice('2', 'FAC-002', new Date('2024-02-20'), 200, 200),
      ];

      const sorted = service.sortInvoicesByDate(invoices);

      expect(sorted[0].id).toBe('1'); // Enero (más antigua)
      expect(sorted[1].id).toBe('2'); // Febrero
      expect(sorted[2].id).toBe('3'); // Marzo (más nueva)
    });

    it('should not mutate original array', () => {
      const invoices = [
        createInvoice('2', 'FAC-002', new Date('2024-02-20'), 200, 200),
        createInvoice('1', 'FAC-001', new Date('2024-01-10'), 100, 100),
      ];

      service.sortInvoicesByDate(invoices);

      expect(invoices[0].id).toBe('2'); // Original sin modificar
    });
  });

  describe('calculateTotalPending', () => {
    it('should sum all balances', () => {
      const invoices = [
        createInvoice('1', 'FAC-001', new Date('2024-01-10'), 1000, 500),
        createInvoice('2', 'FAC-002', new Date('2024-02-20'), 2000, 1500),
        createInvoice('3', 'FAC-003', new Date('2024-03-15'), 500, 500),
      ];

      const total = service.calculateTotalPending(invoices);

      // 500 + 1500 + 500 = 2500
      expect(total.toString()).toBe('2500.00');
    });

    it('should return zero for empty array', () => {
      const total = service.calculateTotalPending([]);
      expect(total.toString()).toBe('0.00');
    });
  });

  describe('processPayment - exact payment', () => {
    /**
     * Pago exacto: el monto coincide exactamente con el balance
     * Fuente: frmcobranza.frm:511-515
     */
    it('should fully pay a single invoice with exact amount', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 1000, 1000),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(1000),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Verificar pago
      expect(result.payment.amount.toString()).toBe('1000.00');
      expect(result.payment.customerId).toBe('cust-001');
      expect(result.payment.receiptNumber).toBe('REC-001');

      // Verificar allocation
      expect(result.payment.allocations).toHaveLength(1);
      expect(result.payment.allocations[0].invoiceId).toBe('inv-1');
      expect(result.payment.allocations[0].amount.toString()).toBe('1000.00');

      // Verificar factura actualizada
      expect(result.updatedInvoices).toHaveLength(1);
      expect(result.updatedInvoices[0].balance.toString()).toBe('0.00');
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);
      expect(result.updatedInvoices[0].amountApplied.toString()).toBe('1000.00');

      // Sin crédito
      expect(result.appliedAmount.toString()).toBe('1000.00');
      expect(result.creditAmount.toString()).toBe('0.00');
      expect(result.hasCredit).toBe(false);
    });

    it('should pay multiple invoices with exact total', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-10'), 500, 500),
        createInvoice('inv-2', 'FAC-002', new Date('2024-01-20'), 300, 300),
        createInvoice('inv-3', 'FAC-003', new Date('2024-02-01'), 200, 200),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(1000), // Exacto: 500 + 300 + 200
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-15'),
      };

      const result = service.processPayment(input);

      // Todas pagadas
      expect(result.payment.allocations).toHaveLength(3);
      expect(result.updatedInvoices.every(inv => inv.status === InvoiceStatus.PAID)).toBe(true);
      expect(result.appliedAmount.toString()).toBe('1000.00');
      expect(result.creditAmount.toString()).toBe('0.00');
    });
  });

  describe('processPayment - partial payment', () => {
    /**
     * Pago parcial: el monto es menor que el balance
     * Fuente: frmcobranza.frm:516-519
     */
    it('should partially pay a single invoice', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 1000, 1000),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(400),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Verificar allocation
      expect(result.payment.allocations).toHaveLength(1);
      expect(result.payment.allocations[0].amount.toString()).toBe('400.00');

      // Verificar factura actualizada
      expect(result.updatedInvoices[0].balance.toString()).toBe('600.00');
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PARTIAL);
      expect(result.updatedInvoices[0].previousBalance.toString()).toBe('1000.00');

      // Sin crédito (todo aplicado)
      expect(result.appliedAmount.toString()).toBe('400.00');
      expect(result.creditAmount.toString()).toBe('0.00');
    });

    it('should pay first invoice fully and second partially (FIFO)', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-10'), 500, 500),
        createInvoice('inv-2', 'FAC-002', new Date('2024-01-20'), 800, 800),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(700), // 500 + 200
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Dos allocations
      expect(result.payment.allocations).toHaveLength(2);

      // Primera factura: pagada completamente
      expect(result.payment.allocations[0].invoiceId).toBe('inv-1');
      expect(result.payment.allocations[0].amount.toString()).toBe('500.00');
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);
      expect(result.updatedInvoices[0].balance.toString()).toBe('0.00');

      // Segunda factura: pagada parcialmente
      expect(result.payment.allocations[1].invoiceId).toBe('inv-2');
      expect(result.payment.allocations[1].amount.toString()).toBe('200.00');
      expect(result.updatedInvoices[1].status).toBe(InvoiceStatus.PARTIAL);
      expect(result.updatedInvoices[1].balance.toString()).toBe('600.00');

      expect(result.creditAmount.toString()).toBe('0.00');
    });
  });

  describe('processPayment - multiple invoices (FIFO order)', () => {
    /**
     * Verifica que las facturas se procesen en orden FIFO
     * (por fecha ascendente, no por orden de entrada)
     */
    it('should process invoices in date order regardless of input order', () => {
      // Intencionalmente desordenadas
      const invoices = [
        createInvoice('inv-3', 'FAC-003', new Date('2024-03-01'), 300, 300),
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-01'), 100, 100),
        createInvoice('inv-2', 'FAC-002', new Date('2024-02-01'), 200, 200),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(250), // Alcanza para inv-1 (100) + inv-2 parcial (150)
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-04-01'),
      };

      const result = service.processPayment(input);

      // Debe procesar en orden: inv-1, inv-2, inv-3
      expect(result.payment.allocations).toHaveLength(2);

      // Primera: inv-1 (enero, más antigua)
      expect(result.payment.allocations[0].invoiceId).toBe('inv-1');
      expect(result.payment.allocations[0].amount.toString()).toBe('100.00');

      // Segunda: inv-2 (febrero)
      expect(result.payment.allocations[1].invoiceId).toBe('inv-2');
      expect(result.payment.allocations[1].amount.toString()).toBe('150.00');

      // inv-3 no se toca (no alcanzó el dinero)
      expect(result.updatedInvoices.find(i => i.id === 'inv-3')).toBeUndefined();
    });
  });

  describe('processPayment - with credit (dinero a favor)', () => {
    /**
     * Pago con sobrante: genera crédito a favor del cliente
     * Fuente: frmcobranza.frm:438-450
     */
    it('should return credit when payment exceeds total pending', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 500, 500),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(750), // 250 de más
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Factura pagada completamente
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);
      expect(result.payment.allocations[0].amount.toString()).toBe('500.00');

      // Crédito a favor
      expect(result.appliedAmount.toString()).toBe('500.00');
      expect(result.creditAmount.toString()).toBe('250.00');
      expect(result.hasCredit).toBe(true);
    });

    it('should handle payment with no pending invoices (all credit)', () => {
      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(1000),
        pendingInvoices: [], // Sin facturas pendientes
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Sin allocations
      expect(result.payment.allocations).toHaveLength(0);
      expect(result.updatedInvoices).toHaveLength(0);

      // Todo es crédito
      expect(result.appliedAmount.toString()).toBe('0.00');
      expect(result.creditAmount.toString()).toBe('1000.00');
      expect(result.hasCredit).toBe(true);
    });
  });

  describe('processPayment - edge cases', () => {
    it('should throw error for zero payment', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 1000, 1000),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(0),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      expect(() => service.processPayment(input)).toThrow('Payment amount must be positive');
    });

    it('should throw error for negative payment', () => {
      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(-100),
        pendingInvoices: [],
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      expect(() => service.processPayment(input)).toThrow('Payment amount must be positive');
    });

    it('should skip invoices with zero balance', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-10'), 500, 0, InvoiceStatus.PAID),
        createInvoice('inv-2', 'FAC-002', new Date('2024-01-20'), 300, 300),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(200),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Solo debe procesar inv-2
      expect(result.payment.allocations).toHaveLength(1);
      expect(result.payment.allocations[0].invoiceId).toBe('inv-2');
      expect(result.updatedInvoices).toHaveLength(1);
    });

    it('should handle invoices with partial balance (already partially paid)', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 1000, 400, InvoiceStatus.PARTIAL),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(400), // Exacto al balance restante
        pendingInvoices: invoices,
        receiptNumber: 'REC-002',
        date: new Date('2024-02-15'),
      };

      const result = service.processPayment(input);

      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);
      expect(result.updatedInvoices[0].balance.toString()).toBe('0.00');
      expect(result.updatedInvoices[0].previousBalance.toString()).toBe('400.00');
    });

    it('should handle decimal amounts correctly', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 100.50, 100.50),
        createInvoice('inv-2', 'FAC-002', new Date('2024-01-20'), 50.25, 50.25),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(125.75),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      // Primera: pagada completa (100.50)
      expect(result.payment.allocations[0].amount.toString()).toBe('100.50');
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);

      // Segunda: pagada parcial (25.25)
      expect(result.payment.allocations[1].amount.toString()).toBe('25.25');
      expect(result.updatedInvoices[1].balance.toString()).toBe('25.00');
      expect(result.updatedInvoices[1].status).toBe(InvoiceStatus.PARTIAL);

      expect(result.creditAmount.toString()).toBe('0.00');
    });
  });

  describe('legacy VB6 calculation match', () => {
    /**
     * Simulación exacta del flujo legacy de frmcobranza.frm
     */
    it('should match legacy cobranza behavior', () => {
      // Escenario: Cliente tiene 3 facturas pendientes
      // Paga $2000, que cubre la primera completa, segunda completa, tercera parcial
      const invoices = [
        createInvoice('fac-001', 'R0000-00000101', new Date('2024-01-05'), 800, 800),
        createInvoice('fac-002', 'R0000-00000102', new Date('2024-01-15'), 600, 600),
        createInvoice('fac-003', 'R0000-00000103', new Date('2024-01-25'), 1000, 1000),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cli-00123',
        paymentAmount: Decimal.fromNumber(2000),
        pendingInvoices: invoices,
        receiptNumber: 'R0001-00001',
        date: new Date('2024-02-10'),
      };

      const result = service.processPayment(input);

      // Verificar allocations en orden FIFO
      expect(result.payment.allocations).toHaveLength(3);

      // FAC-001: 800 pagado, balance 0
      expect(result.payment.allocations[0].amount.toString()).toBe('800.00');
      expect(result.updatedInvoices[0].balance.toString()).toBe('0.00');
      expect(result.updatedInvoices[0].status).toBe(InvoiceStatus.PAID);

      // FAC-002: 600 pagado, balance 0
      expect(result.payment.allocations[1].amount.toString()).toBe('600.00');
      expect(result.updatedInvoices[1].balance.toString()).toBe('0.00');
      expect(result.updatedInvoices[1].status).toBe(InvoiceStatus.PAID);

      // FAC-003: 600 pagado (2000 - 800 - 600 = 600), balance 400
      expect(result.payment.allocations[2].amount.toString()).toBe('600.00');
      expect(result.updatedInvoices[2].balance.toString()).toBe('400.00');
      expect(result.updatedInvoices[2].status).toBe(InvoiceStatus.PARTIAL);

      // Totales
      expect(result.appliedAmount.toString()).toBe('2000.00');
      expect(result.creditAmount.toString()).toBe('0.00');
      expect(result.hasCredit).toBe(false);
    });

    it('should handle legacy "dinero a favor" scenario', () => {
      // Escenario: Cliente paga más de lo que debe
      // Fuente: frmcobranza.frm:438-450
      const invoices = [
        createInvoice('fac-001', 'R0000-00000101', new Date('2024-01-05'), 500, 500),
        createInvoice('fac-002', 'R0000-00000102', new Date('2024-01-15'), 300, 300),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cli-00123',
        paymentAmount: Decimal.fromNumber(1000), // Debe 800, paga 1000
        pendingInvoices: invoices,
        receiptNumber: 'R0001-00002',
        date: new Date('2024-02-10'),
      };

      const result = service.processPayment(input);

      // Ambas facturas pagadas
      expect(result.updatedInvoices).toHaveLength(2);
      expect(result.updatedInvoices.every(inv => inv.status === InvoiceStatus.PAID)).toBe(true);

      // Crédito a favor: 1000 - 800 = 200
      expect(result.appliedAmount.toString()).toBe('800.00');
      expect(result.creditAmount.toString()).toBe('200.00');
      expect(result.hasCredit).toBe(true);
    });
  });

  describe('payment metadata', () => {
    it('should preserve all payment metadata', () => {
      const testDate = new Date('2024-06-15T10:30:00');
      const invoices = [
        createInvoice('inv-1', 'FAC-001', new Date('2024-01-15'), 100, 100),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'customer-uuid-123',
        paymentAmount: Decimal.fromNumber(100),
        pendingInvoices: invoices,
        receiptNumber: 'REC-2024-00001',
        date: testDate,
      };

      const result = service.processPayment(input);

      expect(result.payment.customerId).toBe('customer-uuid-123');
      expect(result.payment.receiptNumber).toBe('REC-2024-00001');
      expect(result.payment.date).toEqual(testDate);
      expect(result.payment.id).toBeDefined();
      expect(result.payment.id.startsWith('pay-')).toBe(true);
    });

    it('should include invoice numbers in allocations', () => {
      const invoices = [
        createInvoice('inv-1', 'FAC-2024-00001', new Date('2024-01-15'), 100, 100),
        createInvoice('inv-2', 'FAC-2024-00002', new Date('2024-01-20'), 200, 200),
      ];

      const input: ProcessPaymentInput = {
        customerId: 'cust-001',
        paymentAmount: Decimal.fromNumber(300),
        pendingInvoices: invoices,
        receiptNumber: 'REC-001',
        date: new Date('2024-02-01'),
      };

      const result = service.processPayment(input);

      expect(result.payment.allocations[0].invoiceNumber).toBe('FAC-2024-00001');
      expect(result.payment.allocations[1].invoiceNumber).toBe('FAC-2024-00002');
    });
  });
});
