'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Props {
  brands: string[];
}

export function StockFilters({ brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [code, setCode] = useState(searchParams.get('code') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [description, setDescription] = useState(searchParams.get('description') || '');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update URL when filters change (with debounce for text inputs)
  function updateFilters(newCode: string, newBrand: string, newDescription: string, immediate = false) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const update = () => {
      const params = new URLSearchParams();
      if (newCode) params.set('code', newCode);
      if (newBrand) params.set('brand', newBrand);
      if (newDescription) params.set('description', newDescription);
      router.replace(`${pathname}?${params.toString()}`);
    };

    if (immediate) {
      update();
    } else {
      debounceRef.current = setTimeout(update, 300);
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function handleCodeChange(value: string) {
    setCode(value);
    updateFilters(value, brand, description);
  }

  function handleBrandChange(value: string) {
    setBrand(value);
    updateFilters(code, value, description, true); // immediate for dropdown
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);
    updateFilters(code, brand, value);
  }

  function clearFilters() {
    setCode('');
    setBrand('');
    setDescription('');
    router.replace(pathname);
  }

  const hasFilters = code || brand || description;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Code filter */}
      <div className="relative">
        <input
          type="text"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="Código..."
          className="w-28 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Brand filter */}
      <div className="relative">
        <select
          value={brand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="w-40 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Description filter */}
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="text"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Descripción..."
          className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Clear button */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar
        </button>
      )}
    </div>
  );
}
