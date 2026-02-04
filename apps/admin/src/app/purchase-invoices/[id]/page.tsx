import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';
import { ReviewForm } from './ReviewForm';
import { PdfViewer } from './PdfViewer';
import { extractInvoiceData } from '@/lib/pdf/extractor';

interface Props {
  params: { id: string };
}

export default async function PurchaseInvoiceDetailPage({ params }: Props) {
  const invoice = await prisma.purchaseInvoice.findUnique({
    where: { id: params.id },
    include: {
      supplier: true,
      items: true,
    },
  });

  if (!invoice) {
    notFound();
  }

  // Si no tiene datos extraidos, intentar extraer ahora
  let extractedData = invoice.extractedData as {
    rawText?: string;
    parsedData?: Record<string, unknown>;
    confidence?: number;
    usedOCR?: boolean;
  } | null;

  if (!extractedData && (invoice.status === 'PENDING_REVIEW' || invoice.status === 'IN_REVIEW')) {
    try {
      const result = await extractInvoiceData(invoice.pdfPath);
      extractedData = {
        rawText: result.rawText,
        parsedData: result.parsedData as unknown as Record<string, unknown>,
        confidence: result.confidence,
        usedOCR: result.usedOCR,
      };

      // Guardar los datos extraidos
      await prisma.purchaseInvoice.update({
        where: { id: invoice.id },
        data: {
          extractedData: JSON.parse(JSON.stringify(extractedData)),
          status: 'IN_REVIEW',
          // Pre-llenar campos si no tienen valor
          type: invoice.type ?? (result.parsedData.invoiceType as 'A' | 'B' | 'C' | null),
          number: invoice.number ?? result.parsedData.invoiceNumber,
          date: invoice.date ?? result.parsedData.date,
          subtotal: invoice.subtotal.toString() === '0' && result.parsedData.subtotal
            ? result.parsedData.subtotal
            : invoice.subtotal,
          tax21: invoice.tax21.toString() === '0' && result.parsedData.tax21
            ? result.parsedData.tax21
            : invoice.tax21,
          tax105: invoice.tax105.toString() === '0' && result.parsedData.tax105
            ? result.parsedData.tax105
            : invoice.tax105,
          total: invoice.total.toString() === '0' && result.parsedData.total
            ? result.parsedData.total
            : invoice.total,
        },
      });
    } catch (error) {
      console.error('Error extracting invoice data:', error);
    }
  }

  // Recargar la factura con los datos actualizados
  const updatedInvoice = await prisma.purchaseInvoice.findUnique({
    where: { id: params.id },
    include: {
      supplier: true,
      items: true,
    },
  });

  if (!updatedInvoice) {
    notFound();
  }

  const confidence = (updatedInvoice.extractedData as { confidence?: number } | null)?.confidence ?? 0;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/purchase-invoices"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Facturas de Compra
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Revision de Factura
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Proveedor:</span>{' '}
                <Link
                  href={`/suppliers/${updatedInvoice.supplier.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
                >
                  {updatedInvoice.supplier.businessName}
                </Link>
              </div>
              <div>
                <span className="text-slate-500">Archivo:</span>{' '}
                <span className="text-slate-700">{updatedInvoice.originalFileName}</span>
              </div>
              <div>
                <span className="text-slate-500">Subido:</span>{' '}
                <span className="text-slate-700">{formatDateTime(updatedInvoice.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={updatedInvoice.status} />
            {confidence > 0 && (
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                confidence >= 80
                  ? 'bg-emerald-100 text-emerald-700'
                  : confidence >= 50
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                OCR: {confidence}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content: PDF + Form side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              PDF Original
            </h2>
          </div>
          <PdfViewer pdfPath={updatedInvoice.pdfPath} />
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Datos de la Factura
            </h2>
          </div>
          <ReviewForm invoice={updatedInvoice} />
        </div>
      </div>
    </div>
  );
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
