import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { InvoiceForm } from './InvoiceForm';

interface Props {
  searchParams: { customerId?: string };
}

export default async function NewInvoicePage({ searchParams }: Props) {
  const customerId = searchParams.customerId;

  const customer = customerId
    ? await prisma.customer.findUnique({ where: { id: customerId } })
    : null;

  // No customer selected
  if (!customer) {
    return (
      <div>
        <Link
          href="/invoices"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Facturas
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          </svg>
          <h2 className="text-lg font-medium text-slate-900 mb-2">Seleccioná un cliente</h2>
          <p className="text-sm text-slate-500 mb-6">
            Para crear una factura, primero seleccioná un cliente desde el listado.
          </p>
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir a Clientes
          </Link>
        </div>
      </div>
    );
  }

  // Fetch products for the form
  const products = await prisma.product.findMany({
    include: { pricing: true },
    orderBy: { code: 'asc' },
  });

  // Serialize for client component
  const serializedProducts = products.map((p) => ({
    id: p.id,
    code: p.code,
    description: p.description,
    publicPrice: p.pricing ? Number(p.pricing.publicPrice) : 0,
    tradePrice: p.pricing ? Number(p.pricing.tradePrice) : 0,
    wholesalePrice: p.pricing ? Number(p.pricing.wholesalePrice) : 0,
  }));

  const serializedCustomer = {
    id: customer.id,
    code: customer.code,
    businessName: customer.businessName,
    priceList: customer.priceList,
  };

  return (
    <div>
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
        <h1 className="text-2xl font-semibold text-slate-900">Nueva factura</h1>
        <p className="mt-1 text-sm text-slate-500">
          Para {customer.businessName} ({customer.code})
        </p>
      </div>

      <InvoiceForm customer={serializedCustomer} products={serializedProducts} />
    </div>
  );
}
