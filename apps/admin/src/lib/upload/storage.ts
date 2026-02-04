import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_BASE_PATH = 'public/uploads/invoices';

/**
 * Genera un nombre único para el archivo
 */
function generateUniqueFileName(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = randomBytes(8).toString('hex');
  return `${timestamp}-${random}${ext}`;
}

/**
 * Asegura que el directorio de uploads exista
 */
async function ensureUploadDir(): Promise<string> {
  const uploadPath = path.join(process.cwd(), UPLOAD_BASE_PATH);

  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }

  return uploadPath;
}

/**
 * Guarda un archivo PDF de factura
 * @returns Ruta relativa al archivo guardado (para usar en URLs y DB)
 */
export async function saveInvoicePdf(
  file: File,
  supplierId: string
): Promise<{ path: string; originalName: string }> {
  const uploadDir = await ensureUploadDir();

  // Crear subdirectorio por proveedor
  const supplierDir = path.join(uploadDir, supplierId);
  if (!existsSync(supplierDir)) {
    await mkdir(supplierDir, { recursive: true });
  }

  const uniqueName = generateUniqueFileName(file.name);
  const filePath = path.join(supplierDir, uniqueName);

  // Convertir File a Buffer y guardar
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);

  // Retornar ruta relativa (para guardar en DB y usar en URLs)
  const relativePath = `/uploads/invoices/${supplierId}/${uniqueName}`;

  return {
    path: relativePath,
    originalName: file.name,
  };
}

/**
 * Obtiene la ruta absoluta del archivo en el servidor
 */
export function getAbsolutePath(relativePath: string): string {
  return path.join(process.cwd(), 'public', relativePath);
}

/**
 * Valida que el archivo sea un PDF válido
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (!file.type.includes('pdf')) {
    return { valid: false, error: 'El archivo debe ser un PDF' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'El archivo no puede superar los 10MB' };
  }

  return { valid: true };
}
