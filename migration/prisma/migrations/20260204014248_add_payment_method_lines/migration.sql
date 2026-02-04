-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'CARD', 'CHECK');

-- CreateTable
CREATE TABLE "payment_method_lines" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_method_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_method_lines_paymentId_idx" ON "payment_method_lines"("paymentId");

-- AddForeignKey
ALTER TABLE "payment_method_lines" ADD CONSTRAINT "payment_method_lines_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
