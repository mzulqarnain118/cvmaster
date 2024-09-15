-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('month', 'quarterly', 'sixMonths', 'year', 'days');

-- CreateTable
CREATE TABLE "Plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(9,2) NOT NULL,
    "currency" TEXT DEFAULT '$',
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "duration" "Duration" NOT NULL DEFAULT 'month',
    "days" INTEGER DEFAULT 0,
    "trialPeriod" INTEGER NOT NULL DEFAULT 0,
    "priceId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plans_id_key" ON "Plans"("id");
