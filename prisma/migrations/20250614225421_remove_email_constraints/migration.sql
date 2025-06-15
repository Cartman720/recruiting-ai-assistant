-- DropIndex
DROP INDEX "Candidate_email_key";

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "email" DROP NOT NULL;
