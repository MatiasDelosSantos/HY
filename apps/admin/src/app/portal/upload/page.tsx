import { redirect } from 'next/navigation';
import { getSupplierFromSession } from '@/lib/auth/session';
import { UploadForm } from './UploadForm';

export default async function PortalUploadPage() {
  const supplier = await getSupplierFromSession();

  if (!supplier) {
    redirect('/portal/login');
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900">Cargar Factura</h2>
        <p className="mt-1 text-sm text-slate-500">
          Subi tu factura en formato PDF para que sea procesada
        </p>
      </div>

      <UploadForm supplierId={supplier.id} />
    </div>
  );
}
