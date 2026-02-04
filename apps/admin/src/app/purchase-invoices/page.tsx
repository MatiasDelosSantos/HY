import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { StatusBadge } from '@/components/StatusBadge';
import { PurchaseInvoiceStatus } from '@prisma/client';

interface Props {
  searchParams: { q?: string; status?: string };
}

export default async function PurchaseInvoicesPage({ searchParams }: Props) {
  const query = searchParams.q?.trim().toLowerCase();
  const statusFilter = searchParams.status as PurchaseInvoiceStatus | undefined;

  const whereClause: {
    status?: PurchaseInvoiceStatus;
    OR?: Array<{
      number?: { contains: string; mode: 'insensitive' };
      originalFileName?: { contains: string; mode: 'insensitive' };
      supplier?: { businessName: { contains: string; mode: 'insensitive' } };
    }>;
  } = {};

  if (statusFilter && Object.values(PurchaseInvoiceStatus).includes(statusFilter)) {
    whereClause.status = statusFilter;
  }

  if (query) {
    whereClause.OR = [
      { number: { contains: query, mode: 'insensitive' } },
      { originalFileName: { contains: query, mode: 'insensitive' } },
      { supplier: { businessName: { contains: query, mode: 'insensitive' } } },
    ];
  }

  const invoices = await prisma.purchaseInvoice.findMany({
    where: whereClause,
    include: {
      supplier: {
        select: {
          id: true,
          code: true,
          businessName: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const counts = await prisma.purchaseInvoice.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  const statusCounts: Record<string, number> = {};
  counts.forEach((c) => {
    statusCounts[c.status] = c._count.status;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Facturas de Compra</h1>
        <p className="mt-1 text-sm text-slate-500">
          Revision y aprobacion de facturas recibidas de proveedores
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <Link
          href="/purchase-invoices"
          className={`bg-white rounded-xl border p-4 transition-colors ${
            !statusFilter ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-medium text-slate-500">Total</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {Object.values(statusCounts).reduce((a, b) => a + b, 0)}
          </div>
        </Link>
        <Link
          href="/purchase-invoices?status=PENDING_REVIEW"
          className={`bg-white rounded-xl border p-4 transition-colors ${
            statusFilter === 'PENDING_REVIEW' ? 'border-yellow-500 ring-1 ring-yellow-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-medium text-slate-500">Pendientes</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {statusCounts['PENDING_REVIEW'] || 0}
          </div>
        </Link>
        <Link
          href="/purchase-invoices?status=IN_REVIEW"
          className={`bg-white rounded-xl border p-4 transition-colors ${
            statusFilter === 'IN_REVIEW' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-medium text-slate-500">En revision</div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {statusCounts['IN_REVIEW'] || 0}
          </div>
        </Link>
        <Link
          href="/purchase-invoices?status=APPROVED"
          className={`bg-white rounded-xl border p-4 transition-colors ${
            statusFilter === 'APPROVED' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-medium text-slate-500">Aprobadas</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-600">
            {statusCounts['APPROVED'] || 0}
          </div>
        </Link>
        <Link
          href="/purchase-invoices?status=REJECTED"
          className={`bg-white rounded-xl border p-4 transition-colors ${
            statusFilter === 'REJECTED' ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-sm font-medium text-slate-500">Rechazadas</div>
          <div className="mt-1 text-2xl font-semibold text-red-600">
            {statusCounts['REJECTED'] || 0}
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar placeholder="Buscar por numero, archivo o proveedor..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Archivo
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Numero
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">
                      {query || statusFilter ? 'No se encontraron facturas' : 'No hay facturas de compra'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {formatDate(invoice.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/suppliers/${invoice.supplier.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-blue-600"
                    >
                      {invoice.supplier.businessName}
                    </Link>
                    <div className="text-xs text-slate-500">
                      Cod: {invoice.supplier.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                      </svg>
                      <span className="text-sm text-slate-700 truncate max-w-[150px]">
                        {invoice.originalFileName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-slate-600">
                      {invoice.type ? `${invoice.type} ` : ''}
                      {invoice.number ?? '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {Number(invoice.total) > 0 ? formatCurrency(Number(invoice.total)) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/purchase-invoices/${invoice.id}`}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {invoice.status === 'PENDING_REVIEW' ? 'Revisar' : 'Ver'}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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
