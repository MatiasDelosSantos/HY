// =============================================================================
// INVOICE SERVICE - Sistema HY
// =============================================================================
// Servicio de dominio para cálculo de facturas/remitos
// Fuente legacy: frmremito.frm:565-612 (cálculos de totales)
// =============================================================================

import { Decimal } from '../types/decimal';

/**
 * Item de línea para cálculo de factura
 */
export interface InvoiceItemInput {
  /** Cantidad del producto */
  quantity: Decimal;
  /** Precio unitario */
  unitPrice: Decimal;
  /** Descuento por ítem en porcentaje (0-100) - opcional */
  discountPercent?: Decimal;
}

/**
 * Parámetros para cálculo de factura
 */
export interface InvoiceCalculationInput {
  /** Items de la factura */
  items: InvoiceItemInput[];
  /** Bonificación general en porcentaje (0-100) - opcional */
  invoiceDiscountPercent?: Decimal;
  /** Tasa de IVA como número (default 0.21 = 21%) - NO es un valor monetario */
  taxRate?: number;
  /** Fecha de emisión */
  issueDate: Date;
}

/**
 * Resultado del cálculo de línea individual
 */
export interface InvoiceItemResult {
  /** Cantidad */
  quantity: Decimal;
  /** Precio unitario */
  unitPrice: Decimal;
  /** Subtotal de línea (quantity * unitPrice) */
  lineSubtotal: Decimal;
  /** Descuento aplicado a la línea */
  lineDiscount: Decimal;
  /** Total de línea (lineSubtotal - lineDiscount) */
  lineTotal: Decimal;
}

/**
 * Resultado del cálculo de factura
 * Fuente: frmremito.frm:602-608 (mostrar totales)
 */
export interface InvoiceCalculationResult {
  /** Items calculados */
  items: InvoiceItemResult[];
  /** Suma de todos los lineTotal antes de descuento general */
  subtotal: Decimal;
  /** Suma de descuentos por ítem */
  itemDiscountTotal: Decimal;
  /** Descuento general aplicado al subtotal */
  invoiceDiscount: Decimal;
  /** Total de descuentos (itemDiscountTotal + invoiceDiscount) */
  discountTotal: Decimal;
  /** Base imponible (subtotal - invoiceDiscount) */
  taxableBase: Decimal;
  /** IVA 21% (o tasa configurada) */
  tax21: Decimal;
  /** Total final (taxableBase + tax21) */
  total: Decimal;
  /** Saldo pendiente (igual a total inicialmente) */
  balance: Decimal;
  /** Fecha de emisión */
  issueDate: Date;
  /** Fecha de vencimiento (issueDate + 30 días) */
  dueDate: Date;
}

/**
 * Interfaz del servicio de facturas
 */
export interface IInvoiceService {
  /**
   * Calcula los totales de una factura
   */
  calculateInvoice(input: InvoiceCalculationInput): InvoiceCalculationResult;

  /**
   * Calcula una línea individual
   */
  calculateItem(item: InvoiceItemInput): InvoiceItemResult;
}

/**
 * Tasa de IVA por defecto (21%)
 * Fuente: frmremito.frm:599 - vIva21 = (vSubtotal * 0.21)
 */
const DEFAULT_TAX_RATE = 0.21;

/**
 * Días para vencimiento por defecto
 * Fuente: frmremito.frm:732 - vencimiento = Date + 30
 */
const DEFAULT_DUE_DAYS = 30;

/**
 * Implementación del servicio de facturas
 */
export class InvoiceService implements IInvoiceService {
  /**
   * Calcula una línea individual de factura
   *
   * Lógica legacy (frmremito.frm:565):
   * Data1.Recordset!total = (Data1.Recordset!unitario * Data1.Recordset!cantidad)
   *
   * Con descuento (frmremito.frm:617-618):
   * vBonif = vBonif + (Data1.Recordset!total * (Data1.Recordset!bonif / 100))
   */
  calculateItem(item: InvoiceItemInput): InvoiceItemResult {
    const { quantity, unitPrice, discountPercent } = item;

    // lineSubtotal = quantity * unitPrice
    // Fuente: frmremito.frm:565
    const lineSubtotal = quantity.multiply(unitPrice);

    // Calcular descuento si existe
    // Fuente: frmremito.frm:617-618
    let lineDiscount = Decimal.zero();
    if (discountPercent && !discountPercent.isZero()) {
      // lineDiscount = lineSubtotal * (discountPercent / 100)
      lineDiscount = lineSubtotal.percentage(discountPercent);
    }

    // lineTotal = lineSubtotal - lineDiscount
    const lineTotal = lineSubtotal.subtract(lineDiscount);

    return {
      quantity,
      unitPrice,
      lineSubtotal,
      lineDiscount,
      lineTotal,
    };
  }

  /**
   * Calcula los totales de una factura completa
   *
   * Lógica legacy (frmremito.frm:578-612):
   * ```vb
   * Private Sub calculartotales()
   *     vSubtotal = 0
   *     vIva21 = 0
   *     vBonif = 0
   *     Data1.Recordset.MoveFirst
   *     Do While Not Data1.Recordset.EOF
   *         If Data1.Recordset!total <> 0 Then
   *           Calculo  ' Calcula bonificación por línea
   *           vSubtotal = vSubtotal + Data1.Recordset!total
   *         Else
   *             Exit Do
   *         End If
   *         Data1.Recordset.MoveNext
   *     Loop
   *     vSubtotal = vSubtotal - vBonif
   *     vIva21 = (vSubtotal * 0.21)
   *     vtotal = (vSubtotal + vIva21)
   * End Sub
   * ```
   */
  calculateInvoice(input: InvoiceCalculationInput): InvoiceCalculationResult {
    const {
      items,
      invoiceDiscountPercent,
      taxRate = DEFAULT_TAX_RATE,
      issueDate,
    } = input;

    // Calcular cada línea
    const calculatedItems = items.map((item) => this.calculateItem(item));

    // Sumar subtotales de líneas (antes de descuentos de línea)
    // y sumar descuentos por ítem
    let subtotal = Decimal.zero();
    let itemDiscountTotal = Decimal.zero();

    for (const item of calculatedItems) {
      // Sumamos lineTotal (ya tiene el descuento de línea aplicado)
      subtotal = subtotal.add(item.lineTotal);
      // Acumulamos descuentos de línea
      itemDiscountTotal = itemDiscountTotal.add(item.lineDiscount);
    }

    // Calcular descuento general sobre el subtotal
    // Fuente: frmremito.frm:598 - vSubtotal = vSubtotal - vBonif
    let invoiceDiscount = Decimal.zero();
    if (invoiceDiscountPercent && !invoiceDiscountPercent.isZero()) {
      invoiceDiscount = subtotal.percentage(invoiceDiscountPercent);
    }

    // Total de descuentos
    const discountTotal = itemDiscountTotal.add(invoiceDiscount);

    // Base imponible = subtotal - descuento general
    // Fuente: frmremito.frm:598
    const taxableBase = subtotal.subtract(invoiceDiscount);

    // Calcular IVA
    // Fuente: frmremito.frm:599 - vIva21 = (vSubtotal * 0.21)
    const tax21 = taxableBase.multiplyByNumber(taxRate);

    // Total final
    // Fuente: frmremito.frm:600 - vtotal = (vSubtotal + vIva21)
    const total = taxableBase.add(tax21);

    // Balance inicial = total
    // Fuente: frmremito.frm:730 - rFacturas!resto = vtotal
    const balance = total;

    // Calcular fecha de vencimiento
    // Fuente: frmremito.frm:732 - vencimiento = Date + 30
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + DEFAULT_DUE_DAYS);

    return {
      items: calculatedItems,
      subtotal,
      itemDiscountTotal,
      invoiceDiscount,
      discountTotal,
      taxableBase,
      tax21,
      total,
      balance,
      issueDate,
      dueDate,
    };
  }
}

/**
 * Instancia singleton para uso general
 */
export const invoiceService = new InvoiceService();
