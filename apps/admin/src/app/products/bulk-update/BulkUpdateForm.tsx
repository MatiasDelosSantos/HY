'use client';

import { useState } from 'react';
import Link from 'next/link';
import { bulkUpdatePrices, getProductCountInRange } from './actions';

interface Props {
  brands: string[];
}

export function BulkUpdateForm({ brands }: Props) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ updatedCount: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    priceField: 'publicPrice' as 'publicPrice' | 'tradePrice' | 'wholesalePrice',
    brandFrom: brands[0] || '',
    brandTo: brands[brands.length - 1] || '',
    percentage: 0,
  });

  function updateField(field: string, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handlePreview() {
    if (!formData.brandFrom || !formData.brandTo) {
      setError('Debe seleccionar el rango de marcas');
      return;
    }

    if (formData.percentage === 0) {
      setError('El porcentaje debe ser diferente de 0');
      return;
    }

    try {
      const count = await getProductCountInRange(formData.brandFrom, formData.brandTo);
      setProductCount(count);
      setShowConfirm(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el conteo');
    }
  }

  async function handleSubmit() {
    if (updating) return;
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await bulkUpdatePrices({
        priceField: formData.priceField,
        brandFrom: formData.brandFrom,
        brandTo: formData.brandTo,
        percentage: formData.percentage,
      });
      setSuccess(result);
      setShowConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar precios');
    } finally {
      setUpdating(false);
    }
  }

  const priceFieldLabels = {
    publicPrice: 'Precio público',
    tradePrice: 'Precio gremio',
    wholesalePrice: 'Precio mayorista',
  };

  return (
    <>
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

      {/* Success message */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">
              Se actualizaron {success.updatedCount} productos exitosamente
            </span>
          </div>
        </div>
      )}

      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">
          Configuración de actualización
        </h2>

        <div className="space-y-6">
          {/* Price field selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Lista a actualizar
            </label>
            <div className="flex flex-wrap gap-4">
              {(['publicPrice', 'tradePrice', 'wholesalePrice'] as const).map((field) => (
                <label
                  key={field}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.priceField === field
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="priceField"
                    value={field}
                    checked={formData.priceField === field}
                    onChange={(e) => updateField('priceField', e.target.value)}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      formData.priceField === field
                        ? 'border-blue-500'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.priceField === field && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </span>
                  <span className="text-sm font-medium">{priceFieldLabels[field]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Desde marca
              </label>
              <select
                value={formData.brandFrom}
                onChange={(e) => updateField('brandFrom', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hasta marca
              </label>
              <select
                value={formData.brandTo}
                onChange={(e) => updateField('brandTo', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar...</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Percentage */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Porcentaje de ajuste
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.percentage || ''}
                onChange={(e) => updateField('percentage', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Positivo para aumentar, negativo para disminuir
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Confirmar actualización</h3>
            </div>
            <div className="text-sm text-slate-600 mb-6 space-y-2">
              <p>Se actualizará el <strong>{priceFieldLabels[formData.priceField]}</strong></p>
              <p>
                Rango: <strong>{formData.brandFrom}</strong> a <strong>{formData.brandTo}</strong>
              </p>
              <p>
                Ajuste: <strong className={formData.percentage >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {formData.percentage >= 0 ? '+' : ''}{formData.percentage}%
                </strong>
              </p>
              <p className="pt-2 border-t border-slate-200">
                <strong>{productCount}</strong> productos serán afectados
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={updating}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={updating}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  updating
                    ? 'bg-blue-600 opacity-50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {updating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Actualizando...
                  </>
                ) : (
                  'Sí, actualizar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/products"
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="button"
          onClick={handlePreview}
          disabled={!formData.brandFrom || !formData.brandTo || formData.percentage === 0}
          className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
            formData.brandFrom && formData.brandTo && formData.percentage !== 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar precios
        </button>
      </div>
    </>
  );
}
