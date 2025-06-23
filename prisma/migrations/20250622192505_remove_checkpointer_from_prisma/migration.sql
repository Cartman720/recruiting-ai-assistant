/*
  Warnings:

  - You are about to drop the `checkpoint_blobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoint_migrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoint_writes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoints` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "checkpoint_blobs";

-- DropTable
DROP TABLE "checkpoint_migrations";

-- DropTable
DROP TABLE "checkpoint_writes";

-- DropTable
DROP TABLE "checkpoints";
