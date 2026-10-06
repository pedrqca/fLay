/*
  Warnings:

  - A unique constraint covering the columns `[workdayId]` on the table `BankTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BankTransaction" ADD COLUMN     "workdayId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "BankTransaction_workdayId_key" ON "BankTransaction"("workdayId");

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_workdayId_fkey" FOREIGN KEY ("workdayId") REFERENCES "Workday"("id") ON DELETE SET NULL ON UPDATE CASCADE;
