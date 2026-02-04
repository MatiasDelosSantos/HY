'use client';

import { useState } from 'react';
import { createPaymentForInvoice } from './actions';

interface PaymentLine {
  method: 'CASH' | 'TRANSFER' | 'CARD' | 'CHECK';
  amount: string;
}

interface Props {
  invoiceId: string;
  balance: number;
}

const METHOD_LABELS: Record<string, string> = {
  CASH: 'Efectivo',
  TRANSFER: 'Transferencia',
  CARD: 'Tarjeta',
  CHECK: 'Cheque',
};

export function PaymentForm({ invoiceId, balance }: Props) {
  const [lines, setLines] = useState<PaymentLine[]>([
    { method: 'CASH', amount: balance.toString() },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    receiptNumber?: string;
    appliedAmount?: number;
    creditAmount?: number;
    message?: string;
  } | null>(null);

  const total = lines.reduce((sum, l) => {
    const n = parseFloat(l.amount);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  function addLine() {
    setLines([...lines, { method: 'CASH', amount: '' }]);
  }

  function removeLine(index: number) {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  }

  function updateLine(index: number, field: 'method' | 'amount', value: string) {
    const updated = [...lines];
    if (field === 'method') {
      updated[index].method = value as PaymentLine['method'];
    } else {
      updated[index].amount = value;
    }
    setLines(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar líneas
    const validLines = lines
      .map((l) => ({
        method: l.method,
        amount: parseFloat(l.amount),
      }))
      .filter((l) => !isNaN(l.amount) && l.amount > 0);

    if (validLines.length === 0) {
      setResult({ success: false, message: 'Debe agregar al menos un monto válido' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await createPaymentForInvoice({ invoiceId, lines: validLines });
      setResult({
        success: true,
        receiptNumber: res.receiptNumber,
        appliedAmount: res.appliedAmount,
        creditAmount: res.creditAmount,
      });
      setLines([{ method: 'CASH', amount: '0' }]);
    } catch (err) {
      setResult({ success: false, message: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(value);
  }

  if (balance <= 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <svg className="w-10 h-10 mx-auto text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-emerald-700 font-medium">Factura pagada</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
        Registrar pago
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment lines */}
        <div className="space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={line.method}
                onChange={(e) => updateLine(index, 'method', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="CASH">{METHOD_LABELS.CASH}</option>
                <option value="TRANSFER">{METHOD_LABELS.TRANSFER}</option>
                <option value="CARD">{METHOD_LABELS.CARD}</option>
                <option value="CHECK">{METHOD_LABELS.CHECK}</option>
              </select>

              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={line.amount}
                  onChange={(e) => updateLine(index, 'amount', e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {lines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLine(index)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  disabled={loading}
                  title="Quitar línea"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add line button */}
        <button
          type="button"
          onClick={addLine}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 border border-dashed border-slate-300 hover:border-slate-400 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar método de pago
        </button>

        {/* Total summary */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-slate-500">Saldo pendiente:</span>
            <span className="font-medium text-slate-700">{formatCurrency(balance)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Total a pagar:</span>
            <span className="font-semibold text-lg text-slate-900">{formatCurrency(total)}</span>
          </div>
          {total > balance && (
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-500">Saldo a favor:</span>
              <span className="font-medium text-emerald-600">{formatCurrency(total - balance)}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || total <= 0}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
            loading || total <= 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
              Registrar pago
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          result.success
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {result.success ? (
            <div>
              <div className="font-medium mb-1">
                Pago registrado: <span className="font-mono">{result.receiptNumber}</span>
              </div>
              <div className="text-xs space-y-0.5">
                <div>Aplicado a facturas: {formatCurrency(result.appliedAmount ?? 0)}</div>
                {(result.creditAmount ?? 0) > 0 && (
                  <div>Saldo a favor: {formatCurrency(result.creditAmount ?? 0)}</div>
                )}
              </div>
            </div>
          ) : (
            <>{result.message}</>
          )}
        </div>
      )}
    </div>
  );
}
