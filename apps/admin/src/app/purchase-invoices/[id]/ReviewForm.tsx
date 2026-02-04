'use client';

import { useState } from 'react';
import { PurchaseInvoice, Supplier, PurchaseInvoiceItem, PurchaseInvoiceStatus } from '@prisma/client';
import { updatePurchaseInvoice, approvePurchaseInvoice, rejectPurchaseInvoice, markAsPaid } from './actions';

interface Props {
  invoice: PurchaseInvoice & {
    supplier: Supplier;
    items: PurchaseInvoiceItem[];
  };
}

export function ReviewForm({ invoice }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isEditable = invoice.status === 'PENDING_REVIEW' || invoice.status === 'IN_REVIEW';

  const [formData, setFormData] = useState({
    type: invoice.type ?? '',
    number: invoice.number ?? '',
    date: invoice.date ? formatDateForInput(invoice.date) : '',
    dueDate: invoice.dueDate ? formatDateForInput(invoice.dueDate) : '',
    subtotal: Number(invoice.subtotal),
    tax21: Number(invoice.tax21),
    tax105: Number(invoice.tax105),
    total: Number(invoice.total),
    adminNotes: invoice.adminNotes ?? '',
  });

  function updateField(field: string, value: string | number) {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Recalcular total si cambian los montos
      if (field === 'subtotal' || field === 'tax21' || field === 'tax105') {
        const subtotal = field === 'subtotal' ? Number(value) : prev.subtotal;
        const tax21 = field === 'tax21' ? Number(value) : prev.tax21;
        const tax105 = field === 'tax105' ? Number(value) : prev.tax105;
        newData.total = subtotal + tax21 + tax105;
      }

      return newData;
    });
    setError(null);
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      await updatePurchaseInvoice(invoice.id, {
        type: formData.type as 'A' | 'B' | 'C' | null || null,
        number: formData.number || null,
        date: formData.date || null,
        dueDate: formData.dueDate || null,
        subtotal: formData.subtotal,
        tax21: formData.tax21,
        tax105: formData.tax105,
        total: formData.total,
        adminNotes: formData.adminNotes || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleApprove() {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      await handleSave();
      await approvePurchaseInvoice(invoice.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar');
      setSaving(false);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setError('Debe indicar un motivo de rechazo');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await rejectPurchaseInvoice(invoice.id, rejectReason);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar');
      setSaving(false);
    }
  }

  async function handleMarkAsPaid() {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      await markAsPaid(invoice.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como pagada');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800 mb-2">Motivo de rechazo</h3>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Explica por que rechazas esta factura..."
            rows={3}
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleReject}
              disabled={saving}
              className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Confirmar rechazo
            </button>
            <button
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
              }}
              className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Proveedor Info */}
        <div className="pb-4 border-b border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Proveedor
          </label>
          <div className="text-sm text-slate-900">{invoice.supplier.businessName}</div>
          {invoice.supplier.taxId && (
            <div className="text-xs text-slate-500 font-mono">{invoice.supplier.taxId}</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            >
              <option value="">-</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          {/* Numero */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Numero
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => updateField('number', e.target.value)}
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
              placeholder="0001-00000001"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha emision
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>

          {/* Fecha Vencimiento */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vencimiento
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              disabled={!isEditable}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Montos */}
        <div className="pt-4 border-t border-slate-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Subtotal</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => updateField('subtotal', parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">IVA 21%</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tax21}
                  onChange={(e) => updateField('tax21', parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">IVA 10.5%</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tax105}
                  onChange={(e) => updateField('tax105', parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <label className="text-sm font-semibold text-slate-900">Total</label>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => updateField('total', parseFloat(e.target.value) || 0)}
                  disabled={!isEditable}
                  className="w-32 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-right font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Notas internas
          </label>
          <textarea
            value={formData.adminNotes}
            onChange={(e) => updateField('adminNotes', e.target.value)}
            disabled={!isEditable}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
            rows={2}
            placeholder="Notas visibles solo para administradores..."
          />
        </div>

        {/* Rejection Reason Display */}
        {invoice.status === 'REJECTED' && invoice.rejectionReason && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-1">Motivo de rechazo</h4>
            <p className="text-sm text-red-700">{invoice.rejectionReason}</p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200">
          {isEditable ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={saving}
                className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Rechazar
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Guardar
                </button>
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Procesando...' : 'Aprobar'}
                </button>
              </div>
            </div>
          ) : invoice.status === 'APPROVED' ? (
            <button
              onClick={handleMarkAsPaid}
              disabled={saving}
              className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Procesando...' : 'Marcar como pagada'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function formatDateForInput(date: Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}
