import { PurchaseInvoiceStatus } from '@prisma/client';

type StatusConfig = {
  label: string;
  className: string;
};

const statusConfig: Record<PurchaseInvoiceStatus, StatusConfig> = {
  PENDING_REVIEW: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  IN_REVIEW: {
    label: 'En Revisión',
    className: 'bg-blue-100 text-blue-800',
  },
  APPROVED: {
    label: 'Aprobada',
    className: 'bg-green-100 text-green-800',
  },
  REJECTED: {
    label: 'Rechazada',
    className: 'bg-red-100 text-red-800',
  },
  PAID: {
    label: 'Pagada',
    className: 'bg-purple-100 text-purple-800',
  },
};

type Props = {
  status: PurchaseInvoiceStatus;
};

export function StatusBadge({ status }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
