/*
  Warnings:

  - The primary key for the `VerifiedUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `VerifiedUser` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `VerifiedUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `VerifiedUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `VerifiedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VerifiedUser" DROP CONSTRAINT "VerifiedUser_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD CONSTRAINT "VerifiedUser_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "VerifiedUser_email_key" ON "VerifiedUser"("email");
