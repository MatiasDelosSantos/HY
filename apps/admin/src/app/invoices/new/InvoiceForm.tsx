'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createInvoice } from './actions';

interface Product {
  id: string;
  code: string;
  description: string;
  publicPrice: number;
  tradePrice: number;
  wholesalePrice: number;
  stock: number;
}

interface Customer {
  id: string;
  code: string;
  businessName: string;
  priceList: string;
}

interface InvoiceItem {
  productId: string;
  quantity: number;
}

interface Props {
  customer: Customer;
  products: Product[];
}

export function InvoiceForm({ customer, products }: Props) {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!hasItems || saving) return;
    setSaving(true);
    try {
      await createInvoice({
        customerId: customer.id,
        items: items.filter((i) => i.productId && i.quantity > 0),
      });
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  }

  const today = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  // Get price based on customer's price list
  function getUnitPrice(product: Product): number {
    switch (customer.priceList) {
      case 'GREMIO':
        return product.tradePrice;
      case 'MAYORISTA':
        return product.wholesalePrice;
      default:
        return product.publicPrice;
    }
  }

  function getLineTotal(item: InvoiceItem): number {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return 0;
    return getUnitPrice(product) * item.quantity;
  }

  function getSubtotal(): number {
    return items.reduce((sum, item) => sum + getLineTotal(item), 0);
  }

  function addItem() {
    setItems([...items, { productId: '', quantity: 1 }]);
  }

  function updateItem(index: number, field: keyof InvoiceItem, value: string | number) {
    const newItems = [...items];
    if (field === 'quantity') {
      newItems[index].quantity = Number(value) || 0;
    } else {
      newItems[index].productId = value as string;
    }
    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  const hasItems = items.length > 0 && items.some((i) => i.productId && i.quantity > 0);

  // Check for stock warnings
  function getStockWarnings() {
    const warnings: { code: string; description: string; requested: number; available: number }[] = [];
    for (const item of items) {
      if (!item.productId || item.quantity <= 0) continue;
      const product = products.find((p) => p.id === item.productId);
      if (product && item.quantity > product.stock) {
        warnings.push({
          code: product.code,
          description: product.description,
          requested: item.quantity,
          available: product.stock,
        });
      }
    }
    return warnings;
  }

  const stockWarnings = getStockWarnings();

  return (
    <>
      {/* Form card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Datos del comprobante
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cliente
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {customer.businessName}
            </div>
            <p className="mt-1 text-xs text-slate-500">Lista: {customer.priceList}</p>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
              {today}
            </div>
            <p className="mt-1 text-xs text-slate-500">Fecha de emisión</p>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20">
                Pendiente
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Estado inicial</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Ítems ({items.length})
          </h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar ítem
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p className="text-sm">No hay ítems</p>
            <p className="text-xs text-slate-300 mt-1">Hacé click en "Agregar ítem" para comenzar</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-28">
                  Cantidad
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">
                  Precio Unit.
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider w-36">
                  Total
                </th>
                <th className="px-6 py-3.5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                const unitPrice = product ? getUnitPrice(product) : 0;
                const lineTotal = getLineTotal(item);

                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Seleccionar producto...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.code} - {p.description} (Stock: {p.stock})
                          </option>
                        ))}
                      </select>
                      {product && item.quantity > product.stock && (
                        <div className="mt-1 text-xs text-amber-600">
                          Stock insuficiente (disponible: {product.stock})
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm text-slate-600">
                        {product ? formatCurrency(unitPrice) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm font-medium text-slate-900">
                        {product ? formatCurrency(lineTotal) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-700">Subtotal</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-semibold text-slate-900">
                    {formatCurrency(getSubtotal())}
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Stock warnings */}
      {stockWarnings.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-amber-800">Stock insuficiente</h4>
              <ul className="mt-1 text-sm text-amber-700">
                {stockWarnings.map((w, i) => (
                  <li key={i}>
                    {w.code} - {w.description}: solicitado {w.requested}, disponible {w.available}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-amber-600">
                Puede continuar con la factura. El stock quedará en negativo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href={`/customers/${customer.id}`}
          className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="button"
          disabled={!hasItems || saving}
          onClick={handleSubmit}
          className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
            hasItems && !saving
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 opacity-50 cursor-not-allowed'
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
              Guardar factura
            </>
          )}
        </button>
      </div>
    </>
  );
}
