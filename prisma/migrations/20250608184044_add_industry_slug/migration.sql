/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Industry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Industry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Industry" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");
