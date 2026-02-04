'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateCustomer, deleteCustomer } from '../actions';

interface Customer {
  id: string;
  code: string;
  businessName: string;
  address: string | null;
  taxId: string | null;
  phone: string | null;
  taxStatus: string | null;
  invoiceType: string | null;
  priceList: string;
}

interface Props {
  customer: Customer;
}

export function CustomerEditForm({ customer }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    businessName: customer.businessName,
    address: customer.address || '',
    taxId: customer.taxId || '',
    phone: customer.phone || '',
    taxStatus: customer.taxStatus || '',
    invoiceType: customer.invoiceType || '',
    priceList: customer.priceList,
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    if (!formData.businessName.trim()) {
      setError('La razón social es requerida');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateCustomer({
        id: customer.id,
        businessName: formData.businessName,
        address: formData.address || undefined,
        taxId: formData.taxId || undefined,
        phone: formData.phone || undefined,
        taxStatus: formData.taxStatus as 'RESPONSABLE_INSCRIPTO' | 'RESPONSABLE_NO_INSCRIPTO' | 'MONOTRIBUTO' | 'CONSUMIDOR_FINAL' | 'EXENTO' | undefined || undefined,
        invoiceType: formData.invoiceType as 'A' | 'B' | 'C' | undefined || undefined,
        priceList: formData.priceList as 'PUBLICO' | 'GREMIO' | 'MAYORISTA',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el cliente');
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteCustomer(customer.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el cliente');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">
          Datos del cliente
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Código
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700">
              {customer.code}
            </div>
            <p className="mt-1 text-xs text-slate-500">No modificable</p>
          </div>

          {/* Razón Social */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre o razón social"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Dirección completa"
            />
          </div>

          {/* CUIT */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              CUIT
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => updateField('taxId', e.target.value)}
              maxLength={13}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="XX-XXXXXXXX-X"
            />
            <p className="mt-1 text-xs text-slate-500">Formato: XX-XXXXXXXX-X</p>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              maxLength={50}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Número de teléfono"
            />
          </div>

          {/* Condición IVA */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Condición IVA
            </label>
            <select
              value={formData.taxStatus}
              onChange={(e) => updateField('taxStatus', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar...</option>
              <option value="RESPONSABLE_INSCRIPTO">Responsable Inscripto</option>
              <option value="RESPONSABLE_NO_INSCRIPTO">Responsable No Inscripto</option>
              <option value="MONOTRIBUTO">Monotributo</option>
              <option value="CONSUMIDOR_FINAL">Consumidor Final</option>
              <option value="EXENTO">Exento</option>
            </select>
          </div>

          {/* Tipo de Factura */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Factura
            </label>
            <select
              value={formData.invoiceType}
              onChange={(e) => updateField('invoiceType', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar...</option>
              <option value="A">A - Responsable Inscripto</option>
              <option value="B">B - Consumidor Final / Monotributo</option>
              <option value="C">C - Monotributo / Exento</option>
            </select>
          </div>

          {/* Lista de Precios */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lista de Precios <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priceList}
              onChange={(e) => updateField('priceList', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PUBLICO">Público</option>
              <option value="GREMIO">Gremio</option>
              <option value="MAYORISTA">Mayorista</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">Determina el precio a aplicar</p>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Eliminar cliente</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              ¿Está seguro de que desea eliminar a <strong>{customer.businessName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  deleting
                    ? 'bg-red-600 opacity-50 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Eliminando...
                  </>
                ) : (
                  'Sí, eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar cliente
        </button>

        <div className="flex items-center gap-3">
          <Link
            href={`/customers/${customer.id}`}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
              saving
                ? 'bg-blue-600 opacity-50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
