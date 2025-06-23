/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_threadId_fkey";

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "title" TEXT;

-- DropTable
DROP TABLE "Message";
