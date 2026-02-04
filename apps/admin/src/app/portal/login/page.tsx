import { redirect } from 'next/navigation';
import { getSupplierFromSession } from '@/lib/auth/session';
import { LoginForm } from './LoginForm';

export default async function PortalLoginPage() {
  const supplier = await getSupplierFromSession();

  if (supplier) {
    redirect('/portal/upload');
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">Iniciar sesion</h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa con tu email y contrasena para acceder al portal
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
