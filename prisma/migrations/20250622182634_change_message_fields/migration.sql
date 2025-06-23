/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Message` table. All the data in the column will be lost.
  - Added the required column `data` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
DROP COLUMN "role",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
