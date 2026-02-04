interface PrintHeaderProps {
  showDate?: boolean;
}

export function PrintHeader({ showDate = true }: PrintHeaderProps) {
  const today = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="print-header border-b-2 border-slate-800 pb-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            HERRAJES H. YRIGOYEN 825 S.A.
          </h1>
          <div className="mt-1 text-sm text-slate-600 space-y-0.5">
            <p>H. Yrigoyen 825 - C.A.B.A.</p>
            <p>Tel: (011) 4381-0521</p>
            <p>CUIT: 30-50472573-5</p>
          </div>
        </div>
        {showDate && (
          <div className="text-right text-sm text-slate-600">
            <p>Fecha de impresión</p>
            <p className="font-medium">{today}</p>
          </div>
        )}
      </div>
    </div>
  );
}
