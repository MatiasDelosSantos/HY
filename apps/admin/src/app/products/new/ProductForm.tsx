'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createProduct } from './actions';

interface Props {
  nextCode: string;
  existingBrands: string[];
}

export function ProductForm({ nextCode, existingBrands }: Props) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(true);

  const [formData, setFormData] = useState({
    brand: '',
    description: '',
    manufacturerCode: '',
    costPrice: 0,
    publicMarkup: 0,
    tradeMarkup: 0,
    wholesaleMarkup: 0,
    publicPrice: 0,
    tradePrice: 0,
    wholesalePrice: 0,
  });

  function updateField(field: string, value: string | number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function calculatePrices() {
    const cost = formData.costPrice;
    const publicPrice = cost + (cost * formData.publicMarkup / 100);
    const tradePrice = cost + (cost * formData.tradeMarkup / 100);
    const wholesalePrice = cost + (cost * formData.wholesaleMarkup / 100);

    setFormData((prev) => ({
      ...prev,
      publicPrice: Math.round(publicPrice * 100) / 100,
      tradePrice: Math.round(tradePrice * 100) / 100,
      wholesalePrice: Math.round(wholesalePrice * 100) / 100,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createProduct({
        brand: formData.brand || undefined,
        description: formData.description,
        manufacturerCode: formData.manufacturerCode || undefined,
        costPrice: formData.costPrice,
        publicMarkup: formData.publicMarkup,
        tradeMarkup: formData.tradeMarkup,
        wholesaleMarkup: formData.wholesaleMarkup,
        publicPrice: formData.publicPrice,
        tradePrice: formData.tradePrice,
        wholesalePrice: formData.wholesalePrice,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el producto');
      setSaving(false);
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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

      {/* Basic data card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">
          Datos del producto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Código
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700">
              {nextCode}
            </div>
            <p className="mt-1 text-xs text-slate-500">Generado automáticamente</p>
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              list="brands-list"
              value={formData.brand}
              onChange={(e) => updateField('brand', e.target.value)}
              maxLength={100}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Seleccionar o escribir nueva marca"
            />
            <datalist id="brands-list">
              {existingBrands.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              maxLength={150}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del producto"
            />
          </div>

          {/* Código de fábrica */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Código de fábrica
            </label>
            <input
              type="text"
              value={formData.manufacturerCode}
              onChange={(e) => updateField('manufacturerCode', e.target.value)}
              maxLength={50}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Código del fabricante"
            />
          </div>
        </div>
      </div>

      {/* Pricing card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => setShowPricing(!showPricing)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Precios
          </h2>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${showPricing ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showPricing && (
          <div className="px-6 pb-6 border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Precio costo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio costo (base)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice || ''}
                  onChange={(e) => updateField('costPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Markup público */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Markup público (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.publicMarkup || ''}
                  onChange={(e) => updateField('publicMarkup', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Markup gremio */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Markup gremio (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.tradeMarkup || ''}
                  onChange={(e) => updateField('tradeMarkup', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Markup mayorista */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Markup mayorista (%)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.wholesaleMarkup || ''}
                  onChange={(e) => updateField('wholesaleMarkup', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Calculate button */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={calculatePrices}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calcular precios
              </button>
            </div>

            {/* Calculated prices */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-4">Precios calculados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Precio público */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Precio público
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.publicPrice || ''}
                    onChange={(e) => updateField('publicPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-slate-500">{formatCurrency(formData.publicPrice)}</p>
                </div>

                {/* Precio gremio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Precio gremio
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.tradePrice || ''}
                    onChange={(e) => updateField('tradePrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-slate-500">{formatCurrency(formData.tradePrice)}</p>
                </div>

                {/* Precio mayorista */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Precio mayorista
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.wholesalePrice || ''}
                    onChange={(e) => updateField('wholesalePrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-slate-500">{formatCurrency(formData.wholesalePrice)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/products"
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
              Guardar producto
            </>
          )}
        </button>
      </div>
    </form>
  );
}
