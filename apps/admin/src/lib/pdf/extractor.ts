import { readFile } from 'fs/promises';
import pdfParse from 'pdf-parse';
import { getAbsolutePath } from '../upload/storage';
import { parseInvoiceData, type ParsedInvoiceData } from './parser';

export interface ExtractionResult {
  success: boolean;
  rawText: string;
  parsedData: ParsedInvoiceData;
  usedOCR: boolean;
  confidence: number;
  error?: string;
}

/**
 * Extrae datos de una factura PDF
 * 1. Intenta extraer texto nativo del PDF
 * 2. Parsea los datos extraidos
 * Nota: OCR deshabilitado temporalmente (Tesseract.js requiere config especial en Next.js)
 */
export async function extractInvoiceData(pdfPath: string): Promise<ExtractionResult> {
  const absolutePath = getAbsolutePath(pdfPath);

  try {
    const pdfBuffer = await readFile(absolutePath);

    // Intentar extraer texto nativo
    let rawText = '';

    try {
      const pdfData = await pdfParse(pdfBuffer);
      rawText = pdfData.text || '';
    } catch (pdfError) {
      console.error('PDF parse error:', pdfError);
      // PDF puede ser escaneado o corrupto
    }

    // Parsear los datos
    const parsedData = parseInvoiceData(rawText);

    // Calcular confianza basada en campos extraidos
    const confidence = calculateConfidence(parsedData);

    return {
      success: rawText.length > 0 || confidence > 0,
      rawText,
      parsedData,
      usedOCR: false,
      confidence,
    };
  } catch (error) {
    console.error('Error extracting invoice data:', error);
    return {
      success: false,
      rawText: '',
      parsedData: {
        cuit: null,
        invoiceType: null,
        invoiceNumber: null,
        date: null,
        subtotal: null,
        tax21: null,
        tax105: null,
        total: null,
      },
      usedOCR: false,
      confidence: 0,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Calcula la confianza de la extraccion basado en campos encontrados
 */
function calculateConfidence(data: ParsedInvoiceData): number {
  const fields = [
    data.cuit,
    data.invoiceType,
    data.invoiceNumber,
    data.date,
    data.total,
  ];

  const foundFields = fields.filter((f) => f !== null).length;
  return Math.round((foundFields / fields.length) * 100);
}
