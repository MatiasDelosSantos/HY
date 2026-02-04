'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addStockEntry, searchProducts } from './actions';

interface Product {
  id: string;
  code: string;
  description: string;
  brand: string | null;
  stock: number;
}

export default function StockEntryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Handle clicks outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchProducts(searchQuery);
        setSearchResults(results);
        setShowResults(true);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  function selectProduct(product: Product) {
    setSelectedProduct(product);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError('');
    setSuccess('');
  }

  function clearProduct() {
    setSelectedProduct(null);
    setQuantity('');
    setReason('');
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || !quantity || loading) return;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser un número mayor a 0');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await addStockEntry({
        productId: selectedProduct.id,
        quantity: qty,
        reason: reason.trim() || undefined,
      });
      setSuccess(`Stock actualizado. Nuevo stock: ${result.newStock} unidades`);
      setSelectedProduct({ ...selectedProduct, stock: result.newStock });
      setQuantity('');
      setReason('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al registrar ingreso');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = selectedProduct && quantity && parseInt(quantity, 10) > 0 && !loading;

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
        <h1 className="text-2xl font-semibold text-slate-900">Ingreso de Stock</h1>
        <p className="mt-1 text-sm text-slate-500">
          Registrar entrada de mercadería al inventario
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-xl">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit}>
            {/* Product search */}
            <div className="mb-6" ref={searchRef}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Producto
              </label>
              {selectedProduct ? (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <div className="font-medium text-slate-900">
                      {selectedProduct.description}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      <span className="font-mono">{selectedProduct.code}</span>
                      {selectedProduct.brand && (
                        <span className="ml-2">- {selectedProduct.brand}</span>
                      )}
                    </div>
                    <div className="text-sm text-blue-600 mt-1">
                      Stock actual: <span className="font-semibold">{selectedProduct.stock}</span> unidades
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearProduct}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    title="Cambiar producto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchResults.length > 0 && setShowResults(true)}
                      placeholder="Buscar por código, descripción o marca..."
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {searching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Search results dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg max-h-64 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => selectProduct(product)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-slate-900 text-sm">
                            {product.description}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-500">
                              <span className="font-mono">{product.code}</span>
                              {product.brand && <span className="ml-2">- {product.brand}</span>}
                            </span>
                            <span className="text-xs text-slate-600">
                              Stock: {product.stock}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg p-4 text-center text-sm text-slate-500">
                      No se encontraron productos
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-2">
                Cantidad a ingresar
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                disabled={!selectedProduct}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-2">
                Motivo / Observación
                <span className="font-normal text-slate-400 ml-1">(opcional)</span>
              </label>
              <input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Compra proveedor, reposición, etc."
                disabled={!selectedProduct}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {/* Preview */}
            {selectedProduct && quantity && parseInt(quantity, 10) > 0 && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="text-sm text-emerald-700">
                  Stock actual: <span className="font-semibold">{selectedProduct.stock}</span>
                  <span className="mx-2">+</span>
                  Ingreso: <span className="font-semibold">{quantity}</span>
                  <span className="mx-2">=</span>
                  Nuevo stock: <span className="font-semibold">{selectedProduct.stock + parseInt(quantity, 10)}</span>
                </div>
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                {success}
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
                type="submit"
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  canSubmit
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-emerald-600 opacity-50 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirmar ingreso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
