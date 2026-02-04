import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CustomerEditForm } from './CustomerEditForm';

interface Props {
  params: { id: string };
}

export default async function EditCustomerPage({ params }: Props) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
  });

  if (!customer) {
    notFound();
  }

  const serializedCustomer = {
    id: customer.id,
    code: customer.code,
    businessName: customer.businessName,
    address: customer.address,
    taxId: customer.taxId,
    phone: customer.phone,
    taxStatus: customer.taxStatus,
    invoiceType: customer.invoiceType,
    priceList: customer.priceList,
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/customers/${customer.id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a {customer.businessName}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Editar cliente</h1>
        <p className="mt-1 text-sm text-slate-500">
          {customer.businessName} ({customer.code})
        </p>
      </div>

      <CustomerEditForm customer={serializedCustomer} />
    </div>
  );
}
