'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PriceCalculatorPage() {
  const [formData, setFormData] = useState({
    costPrice: 0,
    publicMarkup: 0,
    tradeMarkup: 0,
    wholesaleMarkup: 0,
  });

  const [calculated, setCalculated] = useState({
    publicPrice: 0,
    tradePrice: 0,
    wholesalePrice: 0,
  });

  function updateField(field: string, value: number) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function calculatePrices() {
    const cost = formData.costPrice;
    setCalculated({
      publicPrice: Math.round((cost + (cost * formData.publicMarkup / 100)) * 100) / 100,
      tradePrice: Math.round((cost + (cost * formData.tradeMarkup / 100)) * 100) / 100,
      wholesalePrice: Math.round((cost + (cost * formData.wholesaleMarkup / 100)) * 100) / 100,
    });
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  const hasValues = formData.costPrice > 0 && (formData.publicMarkup > 0 || formData.tradeMarkup > 0 || formData.wholesaleMarkup > 0);

  return (
    <div>
      {/* Back link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a Productos
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Calculadora de precios</h1>
        <p className="mt-1 text-sm text-slate-500">
          Calcule precios de venta a partir del costo y márgenes
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Input card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">
            Datos de entrada
          </h2>

          <div className="space-y-6">
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
                className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

            <div className="pt-4">
              <button
                type="button"
                onClick={calculatePrices}
                disabled={!hasValues}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  hasValues
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calcular
              </button>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-6">
            Precios calculados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-600">Precio público</div>
              <div className="mt-1 text-xl font-semibold text-blue-700">
                {formatCurrency(calculated.publicPrice)}
              </div>
              {formData.publicMarkup > 0 && (
                <div className="text-xs text-blue-500 mt-1">+{formData.publicMarkup}%</div>
              )}
            </div>

            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-sm font-medium text-emerald-600">Precio gremio</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700">
                {formatCurrency(calculated.tradePrice)}
              </div>
              {formData.tradeMarkup > 0 && (
                <div className="text-xs text-emerald-500 mt-1">+{formData.tradeMarkup}%</div>
              )}
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-600">Precio mayorista</div>
              <div className="mt-1 text-xl font-semibold text-purple-700">
                {formatCurrency(calculated.wholesalePrice)}
              </div>
              {formData.wholesaleMarkup > 0 && (
                <div className="text-xs text-purple-500 mt-1">+{formData.wholesaleMarkup}%</div>
              )}
            </div>
          </div>

          {/* Formula explanation */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Fórmula utilizada</h3>
            <p className="text-sm text-slate-500">
              <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                Precio = Costo + (Costo × Markup / 100)
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
