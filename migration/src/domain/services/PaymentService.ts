// =============================================================================
// PAYMENT SERVICE - Sistema HY
// =============================================================================
// Servicio de dominio para procesamiento de cobranzas
// Fuente legacy: frmcobranza.frm:404-538 (lógica de imputación)
// =============================================================================

import { Decimal } from '../types/decimal';

// =============================================================================
// TIPOS
// =============================================================================

/**
 * Estado de una factura
 * Fuente: frmremito.frm:731, frmcobranza.frm:515
 */
export enum InvoiceStatus {
  PENDING = 'PENDING',   // P - Pendiente (balance = total)
  PARTIAL = 'PARTIAL',   // Parcialmente cobrado (0 < balance < total)
  PAID = 'PAID',         // C - Cobrado totalmente (balance = 0)
}

/**
 * Factura pendiente de cobro (input simplificado)
 * Solo los campos necesarios para el cálculo
 */
export interface PendingInvoice {
  id: string;
  number: string;
  date: Date;
  total: Decimal;
  balance: Decimal;
  status: InvoiceStatus;
}

/**
 * Factura actualizada después del pago
 */
export interface UpdatedInvoice extends PendingInvoice {
  previousBalance: Decimal;
  amountApplied: Decimal;
}

/**
 * Imputación de pago a una factura
 * Fuente: frmcobranza.frm:510-522 (Data1.Recordset!cobrado)
 */
export interface PaymentAllocation {
  invoiceId: string;
  invoiceNumber: string;
  amount: Decimal;
}

/**
 * Pago generado
 */
export interface Payment {
  id: string;
  receiptNumber: string;
  date: Date;
  customerId: string;
  amount: Decimal;
  allocations: PaymentAllocation[];
}

/**
 * Input para procesar un pago
 */
export interface ProcessPaymentInput {
  /** ID del cliente */
  customerId: string;
  /** Monto del pago */
  paymentAmount: Decimal;
  /** Facturas pendientes (PENDING o PARTIAL con balance > 0) */
  pendingInvoices: PendingInvoice[];
  /** Número de recibo */
  receiptNumber: string;
  /** Fecha del pago */
  date: Date;
}

/**
 * Resultado del procesamiento de pago
 */
export interface ProcessPaymentResult {
  /** Pago generado con allocations */
  payment: Payment;
  /** Facturas actualizadas con nuevos balances y estados */
  updatedInvoices: UpdatedInvoice[];
  /** Monto efectivamente imputado a facturas */
  appliedAmount: Decimal;
  /** Dinero sobrante (crédito a favor del cliente) */
  creditAmount: Decimal;
  /** Indica si hubo crédito a favor */
  hasCredit: boolean;
}

/**
 * Interfaz del servicio de pagos
 */
export interface IPaymentService {
  /**
   * Procesa un pago e imputa a facturas pendientes (FIFO)
   */
  processPayment(input: ProcessPaymentInput): ProcessPaymentResult;

  /**
   * Ordena facturas por fecha (FIFO - más antiguas primero)
   */
  sortInvoicesByDate(invoices: PendingInvoice[]): PendingInvoice[];

  /**
   * Calcula el total pendiente de un conjunto de facturas
   */
  calculateTotalPending(invoices: PendingInvoice[]): Decimal;
}

// =============================================================================
// IMPLEMENTACIÓN
// =============================================================================

/**
 * Genera un ID único simple (para uso en memoria)
 * En producción se usaría UUID de la base de datos
 */
function generateId(): string {
  return `pay-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Implementación del servicio de pagos
 *
 * Lógica basada en frmcobranza.frm:506-538 (dbfactpend_DblClick)
 */
export class PaymentService implements IPaymentService {
  /**
   * Ordena facturas por fecha ascendente (FIFO)
   * Las facturas más antiguas se pagan primero
   *
   * Fuente: El sistema legacy procesa en orden de la grilla,
   * que está ordenada por fecha (frmcobranza.frm:597 - ORDER implícito)
   */
  sortInvoicesByDate(invoices: PendingInvoice[]): PendingInvoice[] {
    return [...invoices].sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Calcula el total pendiente de cobro
   */
  calculateTotalPending(invoices: PendingInvoice[]): Decimal {
    return invoices.reduce(
      (sum, inv) => sum.add(inv.balance),
      Decimal.zero()
    );
  }

  /**
   * Procesa un pago e imputa a facturas pendientes usando FIFO
   *
   * Lógica legacy (frmcobranza.frm:506-538):
   * ```vb
   * If CSng(lblsaldo.Caption) >= Data1.Recordset!resto Then
   *     Data1.Recordset!cobrado = Data1.Recordset!resto
   *     lblsaldo.Caption = Round(lblsaldo.Caption - Data1.Recordset!resto, 2)
   *     Data1.Recordset!resto = 0
   *     Data1.Recordset!estado = "C"
   * Else
   *     Data1.Recordset!cobrado = lblsaldo.Caption
   *     Data1.Recordset!resto = Data1.Recordset!resto - lblsaldo.Caption
   *     lblsaldo.Caption = 0
   * End If
   * ```
   *
   * Dinero a favor (frmcobranza.frm:438-450):
   * ```vb
   * If CSng(lblsaldo.Caption) > 0 Then 'guarda dinero a favor del cliente...
   * ```
   */
  processPayment(input: ProcessPaymentInput): ProcessPaymentResult {
    const {
      customerId,
      paymentAmount,
      pendingInvoices,
      receiptNumber,
      date,
    } = input;

    // Validar que el monto sea positivo
    if (paymentAmount.isZero() || paymentAmount.isNegative()) {
      throw new Error('Payment amount must be positive');
    }

    // Ordenar facturas por fecha (FIFO)
    const sortedInvoices = this.sortInvoicesByDate(pendingInvoices);

    // Filtrar solo facturas con balance > 0
    const invoicesWithBalance = sortedInvoices.filter(
      (inv) => !inv.balance.isZero() && !inv.balance.isNegative()
    );

    // Estado de procesamiento
    let remainingPayment = paymentAmount;
    const allocations: PaymentAllocation[] = [];
    const updatedInvoices: UpdatedInvoice[] = [];

    // Procesar cada factura en orden FIFO
    for (const invoice of invoicesWithBalance) {
      // Si no queda dinero, salir
      if (remainingPayment.isZero()) {
        break;
      }

      const previousBalance = invoice.balance;

      // Calcular cuánto aplicar a esta factura
      // Fuente: frmcobranza.frm:511-518
      let amountToApply: Decimal;
      let newBalance: Decimal;
      let newStatus: InvoiceStatus;

      if (remainingPayment.greaterThan(invoice.balance) ||
          remainingPayment.equals(invoice.balance)) {
        // Caso 1: El pago cubre todo el balance de la factura
        // Fuente: frmcobranza.frm:511-515
        // If CSng(lblsaldo.Caption) >= Data1.Recordset!resto Then
        //     Data1.Recordset!cobrado = Data1.Recordset!resto
        //     Data1.Recordset!resto = 0
        //     Data1.Recordset!estado = "C"
        amountToApply = invoice.balance;
        newBalance = Decimal.zero();
        newStatus = InvoiceStatus.PAID;
      } else {
        // Caso 2: El pago es menor que el balance (pago parcial)
        // Fuente: frmcobranza.frm:516-519
        // Else
        //     Data1.Recordset!cobrado = lblsaldo.Caption
        //     Data1.Recordset!resto = Data1.Recordset!resto - lblsaldo.Caption
        amountToApply = remainingPayment;
        newBalance = invoice.balance.subtract(remainingPayment);
        newStatus = InvoiceStatus.PARTIAL;
      }

      // Crear allocation
      allocations.push({
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        amount: amountToApply,
      });

      // Actualizar factura
      updatedInvoices.push({
        ...invoice,
        balance: newBalance,
        status: newStatus,
        previousBalance,
        amountApplied: amountToApply,
      });

      // Reducir el pago restante
      // Fuente: frmcobranza.frm:513 - lblsaldo.Caption = Round(lblsaldo.Caption - resto, 2)
      remainingPayment = remainingPayment.subtract(amountToApply);
    }

    // Calcular totales
    const appliedAmount = paymentAmount.subtract(remainingPayment);
    const creditAmount = remainingPayment;
    const hasCredit = !creditAmount.isZero();

    // Crear el pago
    const payment: Payment = {
      id: generateId(),
      receiptNumber,
      date,
      customerId,
      amount: paymentAmount,
      allocations,
    };

    return {
      payment,
      updatedInvoices,
      appliedAmount,
      creditAmount,
      hasCredit,
    };
  }
}

/**
 * Instancia singleton para uso general
 */
export const paymentService = new PaymentService();
