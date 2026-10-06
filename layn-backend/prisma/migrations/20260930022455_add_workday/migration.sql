/*
  Warnings:

  - You are about to drop the column `date` on the `TimeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TimeEntry` table. All the data in the column will be lost.
  - Added the required column `workdayId` to the `TimeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimeEntry" DROP CONSTRAINT "TimeEntry_userId_fkey";

-- DropIndex
DROP INDEX "TimeEntry_userId_date_idx";

-- AlterTable
ALTER TABLE "TimeEntry" DROP COLUMN "date",
DROP COLUMN "userId",
ADD COLUMN     "workdayId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Workday" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workday_userId_date_idx" ON "Workday"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Workday_userId_date_key" ON "Workday"("userId", "date");

-- CreateIndex
CREATE INDEX "TimeEntry_workdayId_idx" ON "TimeEntry"("workdayId");

-- AddForeignKey
ALTER TABLE "Workday" ADD CONSTRAINT "Workday_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_workdayId_fkey" FOREIGN KEY ("workdayId") REFERENCES "Workday"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
