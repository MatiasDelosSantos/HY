export interface ParsedInvoiceData {
  cuit: string | null;
  invoiceType: 'A' | 'B' | 'C' | null;
  invoiceNumber: string | null;
  date: Date | null;
  subtotal: number | null;
  tax21: number | null;
  tax105: number | null;
  total: number | null;
}

// Patrones para facturas AFIP argentinas
const PATTERNS = {
  // CUIT: 20-12345678-9, 30-12345678-9, etc.
  cuit: /\b(20|23|24|27|30|33|34)[-\s]?(\d{8})[-\s]?(\d)\b/g,

  // Tipo de factura: "FACTURA A", "Factura tipo B", etc.
  invoiceType: /(?:factura|fact\.?|fc\.?)[\s\-]*(?:tipo[\s\-]*)?(A|B|C)\b/i,

  // Numero de factura: "0001-00001234" o "Nro: 0001-00001234"
  invoiceNumber: /(?:n[°ºro.:\s]+)?(\d{4,5})[\s\-]+(\d{6,8})\b/i,

  // Fecha: "15/01/2026", "15-01-2026"
  date: /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g,

  // Total: "Total: $ 12.100,00" o "TOTAL $ 12100.00"
  total: /\btotal\s*(?:general|final|a\s*pagar)?[\s:]*\$?\s*([\d.,]+)\b/gi,

  // Subtotal: "Subtotal: $ 10.000,00" o "Neto Gravado: $ 10000"
  subtotal: /\b(?:subtotal|neto\s*gravado|importe\s*neto)[\s:]*\$?\s*([\d.,]+)\b/gi,

  // IVA 21%: "IVA 21%: $ 2.100,00"
  iva21: /\b(?:i\.?v\.?a\.?|iva)[\s]*(?:21[\s%]*)[\s:]*\$?\s*([\d.,]+)\b/gi,

  // IVA 10.5%: "IVA 10,5%: $ 1.050,00"
  iva105: /\b(?:i\.?v\.?a\.?|iva)[\s]*(?:10[,.]?5[\s%]*)[\s:]*\$?\s*([\d.,]+)\b/gi,
};

/**
 * Helper para obtener todos los matches de una regex global
 */
function getAllMatches(text: string, regex: RegExp): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(regex.source, regex.flags);
  while ((match = re.exec(text)) !== null) {
    matches.push(match);
  }
  return matches;
}

/**
 * Parsea el texto extraido de una factura y devuelve los datos estructurados
 */
export function parseInvoiceData(text: string): ParsedInvoiceData {
  const result: ParsedInvoiceData = {
    cuit: null,
    invoiceType: null,
    invoiceNumber: null,
    date: null,
    subtotal: null,
    tax21: null,
    tax105: null,
    total: null,
  };

  if (!text || text.trim().length === 0) {
    return result;
  }

  // Extraer CUIT
  const cuitMatch = text.match(PATTERNS.cuit);
  if (cuitMatch && cuitMatch.length > 0) {
    // Tomar el primer CUIT encontrado (probablemente el del emisor)
    const rawCuit = cuitMatch[0].replace(/\s/g, '');
    // Formatear como XX-XXXXXXXX-X
    const cuitParts = rawCuit.match(/(\d{2})-?(\d{8})-?(\d)/);
    if (cuitParts) {
      result.cuit = `${cuitParts[1]}-${cuitParts[2]}-${cuitParts[3]}`;
    }
  }

  // Extraer tipo de factura
  const typeMatch = text.match(PATTERNS.invoiceType);
  if (typeMatch) {
    result.invoiceType = typeMatch[1].toUpperCase() as 'A' | 'B' | 'C';
  }

  // Extraer numero de factura
  const numberMatch = text.match(PATTERNS.invoiceNumber);
  if (numberMatch) {
    const puntoVenta = numberMatch[1].padStart(4, '0');
    const numero = numberMatch[2].padStart(8, '0');
    result.invoiceNumber = `${puntoVenta}-${numero}`;
  }

  // Extraer fecha (tomar la primera que parezca razonable)
  const dateMatches = getAllMatches(text, PATTERNS.date);
  for (const match of dateMatches) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    let year = parseInt(match[3], 10);

    // Ajustar ano de 2 digitos
    if (year < 100) {
      year += year > 50 ? 1900 : 2000;
    }

    // Validar fecha
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
      result.date = new Date(year, month - 1, day);
      break;
    }
  }

  // Extraer total (tomar el ultimo/mayor que suele ser el total final)
  const totalMatches = getAllMatches(text, PATTERNS.total);
  if (totalMatches.length > 0) {
    const lastTotal = totalMatches[totalMatches.length - 1];
    result.total = parseAmount(lastTotal[1]);
  }

  // Extraer subtotal
  const subtotalMatches = getAllMatches(text, PATTERNS.subtotal);
  if (subtotalMatches.length > 0) {
    result.subtotal = parseAmount(subtotalMatches[0][1]);
  }

  // Extraer IVA 21%
  const iva21Matches = getAllMatches(text, PATTERNS.iva21);
  if (iva21Matches.length > 0) {
    result.tax21 = parseAmount(iva21Matches[0][1]);
  }

  // Extraer IVA 10.5%
  const iva105Matches = getAllMatches(text, PATTERNS.iva105);
  if (iva105Matches.length > 0) {
    result.tax105 = parseAmount(iva105Matches[0][1]);
  }

  return result;
}

/**
 * Convierte un string de monto a numero
 * Maneja formatos: "12.100,00", "12100.00", "12,100.00"
 */
function parseAmount(amountStr: string): number | null {
  if (!amountStr) return null;

  // Limpiar espacios
  let cleaned = amountStr.trim();

  // Detectar formato argentino (punto como separador de miles, coma como decimal)
  // vs formato internacional (coma como separador de miles, punto como decimal)
  const hasArgentineFormat = cleaned.includes(',') && cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.');

  if (hasArgentineFormat) {
    // Formato argentino: 12.100,00 -> 12100.00
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // Formato internacional o sin separadores de miles
    cleaned = cleaned.replace(/,/g, '');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}
