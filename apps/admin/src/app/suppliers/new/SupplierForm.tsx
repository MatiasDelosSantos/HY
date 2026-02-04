'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupplier } from './actions';

interface Props {
  nextCode: string;
}

export function SupplierForm({ nextCode }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    taxId: '',
    phone: '',
    email: '',
    password: '',
  });

  function updateField(field: string, value: string) {
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

    if (!formData.password || formData.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createSupplier({
        businessName: formData.businessName,
        address: formData.address || undefined,
        taxId: formData.taxId || undefined,
        phone: formData.phone || undefined,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el proveedor');
      setSaving(false);
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
              {nextCode}
            </div>
            <p className="mt-1 text-xs text-slate-500">Generado automaticamente</p>
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
              placeholder="Nombre o razon social"
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
              placeholder="Direccion completa"
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
              placeholder="Numero de telefono"
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
              placeholder="email@ejemplo.com"
            />
            <p className="mt-1 text-xs text-slate-500">Se usara para acceder al portal de proveedores</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contrasena <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">Contrasena para acceder al portal</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/suppliers"
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
              Guardar proveedor
            </>
          )}
        </button>
      </div>
    </form>
  );
}
