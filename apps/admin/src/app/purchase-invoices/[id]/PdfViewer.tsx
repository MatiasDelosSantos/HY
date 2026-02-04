'use client';

interface Props {
  pdfPath: string;
}

export function PdfViewer({ pdfPath }: Props) {
  return (
    <div className="h-[600px] bg-slate-100">
      <iframe
        src={pdfPath}
        className="w-full h-full border-0"
        title="PDF Factura"
      />
      <div className="p-4 border-t border-slate-200 bg-white">
        <a
          href={pdfPath}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar PDF
        </a>
      </div>
    </div>
  );
}
