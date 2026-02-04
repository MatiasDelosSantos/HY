'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateSupplier, resetSupplierPassword } from '../actions';

interface Props {
  supplier: {
    id: string;
    code: string;
    businessName: string;
    address: string | null;
    taxId: string | null;
    phone: string | null;
    email: string;
    isActive: boolean;
  };
}

export function SupplierEditForm({ supplier }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);

  const [formData, setFormData] = useState({
    businessName: supplier.businessName,
    address: supplier.address ?? '',
    taxId: supplier.taxId ?? '',
    phone: supplier.phone ?? '',
    email: supplier.email,
    isActive: supplier.isActive,
  });

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    if (!formData.businessName.trim()) {
      setError('La razon social es requerida');
      return;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateSupplier(supplier.id, {
        businessName: formData.businessName,
        address: formData.address || undefined,
        taxId: formData.taxId || undefined,
        phone: formData.phone || undefined,
        email: formData.email,
        isActive: formData.isActive,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el proveedor');
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setResettingPassword(true);
    setPasswordMessage(null);

    try {
      await resetSupplierPassword(supplier.id, newPassword);
      setPasswordMessage('Contrasena actualizada correctamente');
      setNewPassword('');
      setShowPasswordReset(false);
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : 'Error al cambiar la contrasena');
    } finally {
      setResettingPassword(false);
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
          Datos del proveedor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Codigo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Codigo
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700">
              {supplier.code}
            </div>
          </div>

          {/* Razon Social */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Razon Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Direccion */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Direccion
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Telefono
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              maxLength={50}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select
              value={formData.isActive ? 'active' : 'inactive'}
              onChange={(e) => updateField('isActive', e.target.value === 'active')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Password Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Seguridad
        </h2>

        {!showPasswordReset ? (
          <button
            type="button"
            onClick={() => setShowPasswordReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Cambiar contrasena
          </button>
        ) : (
          <div className="space-y-4">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nueva contrasena
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimo 6 caracteres"
              />
            </div>
            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.includes('correctamente') ? 'text-emerald-600' : 'text-red-600'}`}>
                {passwordMessage}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resettingPassword}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {resettingPassword ? 'Guardando...' : 'Guardar contrasena'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordReset(false);
                  setNewPassword('');
                  setPasswordMessage(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/suppliers/${supplier.id}`}
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
    </form>
  );
}
