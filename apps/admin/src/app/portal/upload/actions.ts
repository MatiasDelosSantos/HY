'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { saveInvoicePdf, validatePdfFile } from '@/lib/upload/storage';
import { getSupplierFromSession } from '@/lib/auth/session';

export async function uploadPurchaseInvoice(formData: FormData) {
  const supplier = await getSupplierFromSession();

  if (!supplier) {
    return { error: 'No autorizado' };
  }

  const file = formData.get('file') as File | null;

  if (!file) {
    return { error: 'Debes seleccionar un archivo' };
  }

  const validation = validatePdfFile(file);
  if (!validation.valid) {
    return { error: validation.error };
  }

  try {
    const { path, originalName } = await saveInvoicePdf(file, supplier.id);

    const invoice = await prisma.purchaseInvoice.create({
      data: {
        supplierId: supplier.id,
        pdfPath: path,
        originalFileName: originalName,
        status: 'PENDING_REVIEW',
      },
    });

    return { success: true, invoiceId: invoice.id };
  } catch (error) {
    console.error('Error uploading invoice:', error);
    return { error: 'Error al subir la factura. Intenta nuevamente.' };
  }
}

export async function redirectToInvoices() {
  redirect('/portal/invoices');
}
