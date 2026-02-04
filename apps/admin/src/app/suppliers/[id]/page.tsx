import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  params: { id: string };
}

export default async function SupplierDetailPage({ params }: Props) {
  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id },
    include: {
      purchaseInvoices: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!supplier) {
    notFound();
  }

  const totalInvoices = supplier.purchaseInvoices.length;
  const pendingInvoices = supplier.purchaseInvoices.filter(
    (i) => i.status === 'PENDING_REVIEW' || i.status === 'IN_REVIEW'
  ).length;
  const approvedInvoices = supplier.purchaseInvoices.filter(
    (i) => i.status === 'APPROVED' || i.status === 'PAID'
  ).length;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/suppliers"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Proveedores
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{supplier.businessName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-slate-500">Codigo:</span>{' '}
                <span className="font-mono font-medium text-slate-700">{supplier.code}</span>
              </div>
              <div>
                <span className="text-slate-500">CUIT:</span>{' '}
                <span className="font-mono text-slate-700">{supplier.taxId ?? '-'}</span>
              </div>
              <div>
                <span className="text-slate-500">Email:</span>{' '}
                <span className="text-slate-700">{supplier.email}</span>
              </div>
              {supplier.phone && (
                <div>
                  <span className="text-slate-500">Tel:</span>{' '}
                  <span className="text-slate-700">{supplier.phone}</span>
                </div>
              )}
            </div>
            {supplier.address && (
              <div className="mt-2 text-sm text-slate-500">{supplier.address}</div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${
                supplier.isActive
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-600/20'
              }`}
            >
              {supplier.isActive ? 'Activo' : 'Inactivo'}
            </span>
            <Link
              href={`/suppliers/${supplier.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Total facturas</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{totalInvoices}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Pendientes</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">{pendingInvoices}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm font-medium text-slate-500">Aprobadas</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">{approvedInvoices}</div>
        </div>
      </div>

      {/* Facturas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Facturas de compra
          </h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {supplier.purchaseInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                  Sin facturas
                </td>
              </tr>
            ) : (
              supplier.purchaseInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {invoice.date ? formatDate(invoice.date) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/purchase-invoices/${invoice.id}`}
                      className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      {invoice.number ?? invoice.originalFileName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">{invoice.type ?? '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {formatCurrency(Number(invoice.total))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}
