import { redirect } from 'next/navigation';
import { getSupplierFromSession } from '@/lib/auth/session';

export default async function PortalPage() {
  const supplier = await getSupplierFromSession();

  if (supplier) {
    redirect('/portal/upload');
  } else {
    redirect('/portal/login');
  }
}
