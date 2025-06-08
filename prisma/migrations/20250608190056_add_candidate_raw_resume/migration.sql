/*
  Warnings:

  - Added the required column `rawResume` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "rawResume" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;
