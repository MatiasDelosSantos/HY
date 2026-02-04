import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

/**
 * Extrae texto de un PDF usando OCR (Tesseract.js)
 * Util para PDFs escaneados donde el texto no es seleccionable
 */
export async function extractTextWithOCR(pdfPath: string): Promise<OCRResult> {
  try {
    // Tesseract.js puede procesar imagenes directamente
    // Para PDFs, normalmente necesitariamos convertirlos a imagenes primero
    // pero Tesseract.js tiene soporte limitado para PDFs

    // Nota: Esta implementacion es basica. Para produccion,
    // seria mejor usar pdf-to-image para convertir paginas a imagenes
    // y luego procesar cada imagen con OCR.

    const worker = await Tesseract.createWorker('spa', 1, {
      // Configuracion para mejor rendimiento
    });

    // Configurar para mejor deteccion de texto en facturas
    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });

    const { data } = await worker.recognize(pdfPath);

    await worker.terminate();

    return {
      text: data.text,
      confidence: data.confidence,
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Error procesando OCR del documento');
  }
}

/**
 * Procesa multiples paginas de un PDF con OCR
 * Requiere que el PDF haya sido convertido a imagenes previamente
 */
export async function extractTextFromImages(imagePaths: string[]): Promise<OCRResult> {
  const worker = await Tesseract.createWorker('spa');

  const results: string[] = [];
  let totalConfidence = 0;

  for (const imagePath of imagePaths) {
    const { data } = await worker.recognize(imagePath);
    results.push(data.text);
    totalConfidence += data.confidence;
  }

  await worker.terminate();

  return {
    text: results.join('\n\n'),
    confidence: imagePaths.length > 0 ? totalConfidence / imagePaths.length : 0,
  };
}
