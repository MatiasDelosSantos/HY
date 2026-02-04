'use client';

import { useState } from 'react';
import Link from 'next/link';
import { updateProduct, deleteProduct } from '../actions';

interface Product {
  id: string;
  code: string;
  brand: string | null;
  description: string;
  manufacturerCode: string | null;
  pricing: {
    costPrice: number;
    publicMarkup: number;
    tradeMarkup: number;
    wholesaleMarkup: number;
    publicPrice: number;
    tradePrice: number;
    wholesalePrice: number;
  } | null;
}

interface Props {
  product: Product;
  existingBrands: string[];
}

export function ProductEditForm({ product, existingBrands }: Props) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPricing, setShowPricing] = useState(true);

  const [formData, setFormData] = useState({
    brand: product.brand || '',
    description: product.description,
    manufacturerCode: product.manufacturerCode || '',
    costPrice: product.pricing?.costPrice ?? 0,
    publicMarkup: product.pricing?.publicMarkup ?? 0,
    tradeMarkup: product.pricing?.tradeMarkup ?? 0,
    wholesaleMarkup: product.pricing?.wholesaleMarkup ?? 0,
    publicPrice: product.pricing?.publicPrice ?? 0,
    tradePrice: product.pricing?.tradePrice ?? 0,
    wholesalePrice: product.pricing?.wholesalePrice ?? 0,
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
      await updateProduct({
        id: product.id,
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
      setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    setError(null);

    try {
      await deleteProduct(product.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el producto');
      setDeleting(false);
      setShowDeleteConfirm(false);
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
              {product.code}
            </div>
            <p className="mt-1 text-xs text-slate-500">No modificable</p>
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
              <h3 className="text-lg font-semibold text-slate-900">Eliminar producto</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              ¿Está seguro de que desea eliminar <strong>{product.description}</strong>? Esta acción no se puede deshacer.
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
          Eliminar producto
        </button>

        <div className="flex items-center gap-3">
          <Link
            href={`/products/${product.id}`}
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
