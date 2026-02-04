// =============================================================================
// SEED - Datos iniciales para desarrollo y testing
// =============================================================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // =========================================================================
  // 1. CUSTOMER
  // =========================================================================
  const customer = await prisma.customer.create({
    data: {
      code: '00001',
      businessName: 'Cliente Test S.A.',
      address: 'Av. Corrientes 1234',
      phone: '11-4567-8901',
      taxId: '20-12345678-9',
      taxStatus: 'RESPONSABLE_INSCRIPTO',
      invoiceType: 'A',
      priceList: 'PUBLICO',
    },
  });
  console.log(`✅ Customer creado: ${customer.id}`);

  // =========================================================================
  // 2. PRODUCTS con PRICING
  // =========================================================================
  const product1 = await prisma.product.create({
    data: {
      code: '00001',
      brand: 'Phillips',
      description: 'Cerradura Phillips 101 - Embutir',
      manufacturerCode: 'PH-101',
      pricing: {
        create: {
          costPrice: 15000,
          publicMarkup: 80,
          tradeMarkup: 60,
          wholesaleMarkup: 40,
          publicPrice: 27000,     // 15000 * 1.80
          tradePrice: 24000,      // 15000 * 1.60
          wholesalePrice: 21000,  // 15000 * 1.40
        },
      },
    },
    include: { pricing: true },
  });
  console.log(`✅ Product 1 creado: ${product1.code}`);

  const product2 = await prisma.product.create({
    data: {
      code: '00002',
      brand: 'Kallay',
      description: 'Cilindro Doble Paleta Kallay',
      manufacturerCode: 'KAL-DP02',
      pricing: {
        create: {
          costPrice: 8000,
          publicMarkup: 100,
          tradeMarkup: 70,
          wholesaleMarkup: 50,
          publicPrice: 16000,     // 8000 * 2.00
          tradePrice: 13600,      // 8000 * 1.70
          wholesalePrice: 12000,  // 8000 * 1.50
        },
      },
    },
    include: { pricing: true },
  });
  console.log(`✅ Product 2 creado: ${product2.code}`);

  // =========================================================================
  // 3. INVOICE con 2 ITEMS
  // =========================================================================
  // Precios PUBLICO: producto1 = 27000, producto2 = 16000
  // Item 1: 2 x 27000 = 54000
  // Item 2: 3 x 16000 = 48000
  // Subtotal: 102000
  // IVA 21%: 21420
  // Total: 123420

  const invoice = await prisma.invoice.create({
    data: {
      type: 'SALE',
      number: 'A0001-00000001',
      date: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      customerId: customer.id,
      status: 'PARTIAL',
      subtotal: 102000,
      discount: 0,
      tax21: 21420,
      total: 123420,
      balance: 73420, // Después del pago parcial de 50000
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 2,
            unitPrice: 27000,
            discount: 0,
            total: 54000,
          },
          {
            productId: product2.id,
            quantity: 3,
            unitPrice: 16000,
            discount: 0,
            total: 48000,
          },
        ],
      },
    },
    include: { items: true },
  });
  console.log(`✅ Invoice creada: ${invoice.number} (Total: $${invoice.total})`);

  // =========================================================================
  // 4. PAYMENT parcial
  // =========================================================================
  const payment = await prisma.payment.create({
    data: {
      receiptNumber: 'R0001-00001',
      customerId: customer.id,
      date: new Date('2024-01-20'),
      amount: 50000,
      paymentType: 'EFECTIVO',
      allocations: {
        create: {
          invoiceId: invoice.id,
          amount: 50000,
        },
      },
    },
    include: { allocations: true },
  });
  console.log(`✅ Payment creado: $${payment.amount} (aplicado a ${invoice.number})`);

  // =========================================================================
  // RESUMEN
  // =========================================================================
  console.log('\n📊 Resumen del seed:');
  console.log(`   - Customers: 1`);
  console.log(`   - Products: 2`);
  console.log(`   - Invoices: 1 (status: PARTIAL, balance: $${invoice.balance})`);
  console.log(`   - Payments: 1 ($${payment.amount})`);
  console.log('\n✅ Seed completado.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
