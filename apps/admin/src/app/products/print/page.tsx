import { prisma } from '@/lib/prisma';
import { PrintLayout } from '@/components/print/PrintLayout';
import { PrintHeader } from '@/components/print/PrintHeader';

interface Props {
  searchParams: {
    list?: 'public' | 'trade' | 'wholesale';
    brand?: string;
  };
}

const LIST_LABELS: Record<string, string> = {
  public: 'Precio Público',
  trade: 'Precio Gremio',
  wholesale: 'Precio Mayorista',
};

export default async function ProductsPrintPage({ searchParams }: Props) {
  const priceList = searchParams.list || 'public';
  const brandFilter = searchParams.brand?.trim().toLowerCase();

  const allProducts = await prisma.product.findMany({
    orderBy: [{ brand: 'asc' }, { code: 'asc' }],
    include: { pricing: true },
  });

  // Filter by brand if specified
  const products = brandFilter
    ? allProducts.filter((p) => p.brand?.toLowerCase().includes(brandFilter))
    : allProducts;

  // Get price based on selected list
  const getPrice = (product: (typeof products)[0]): number | null => {
    if (!product.pricing) return null;
    switch (priceList) {
      case 'trade':
        return Number(product.pricing.tradePrice) || null;
      case 'wholesale':
        return Number(product.pricing.wholesalePrice) || null;
      default:
        return Number(product.pricing.publicPrice) || null;
    }
  };

  // Group products by brand for better organization
  const productsByBrand = products.reduce(
    (acc, product) => {
      const brand = product.brand || 'Sin marca';
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(product);
      return acc;
    },
    {} as Record<string, typeof products>
  );

  const brands = Object.keys(productsByBrand).sort();
  const listTitle = LIST_LABELS[priceList] || 'Precio Público';

  return (
    <PrintLayout title={`Listado de productos - ${listTitle}`}>
      <div className="max-w-4xl mx-auto p-8">
        <PrintHeader />

        {/* Header */}
        <div className="border-2 border-slate-800 mb-6">
          <div className="bg-slate-100 px-4 py-3 border-b-2 border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">LISTADO DE PRODUCTOS</h2>
              <span className="px-3 py-1 bg-slate-800 text-white text-sm font-medium rounded">
                {listTitle}
              </span>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center text-sm">
            <div>
              {brandFilter && (
                <p>
                  <span className="text-slate-600">Filtrado por marca:</span>{' '}
                  <span className="font-medium uppercase">{brandFilter}</span>
                </p>
              )}
            </div>
            <p className="text-slate-600">
              Total: <span className="font-medium">{products.length} productos</span>
            </p>
          </div>
        </div>

        {/* Products table */}
        <table className="w-full border-2 border-slate-800">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-800">
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Código</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Marca</th>
              <th className="px-3 py-2 text-left text-xs font-bold uppercase">Descripción</th>
              <th className="px-3 py-2 text-right text-xs font-bold uppercase">Precio</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  No hay productos para mostrar
                </td>
              </tr>
            ) : (
              brands.map((brand) =>
                productsByBrand[brand].map((product, index) => {
                  const price = getPrice(product);
                  return (
                    <tr
                      key={product.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="px-3 py-1.5 font-mono text-sm">{product.code}</td>
                      <td className="px-3 py-1.5 text-sm">{product.brand || '—'}</td>
                      <td className="px-3 py-1.5 text-sm">{product.description}</td>
                      <td className="px-3 py-1.5 text-right text-sm font-medium">
                        {price ? formatCurrency(price) : '—'}
                      </td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-800 bg-slate-100">
              <td colSpan={3} className="px-3 py-2 text-right text-sm font-bold uppercase">
                Total productos
              </td>
              <td className="px-3 py-2 text-right text-sm font-bold">{products.length}</td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-300 text-center text-sm text-slate-500">
          <p>Listado generado el {formatDate(new Date())}</p>
          <p className="mt-1">Los precios pueden variar sin previo aviso</p>
        </div>
      </div>
    </PrintLayout>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
