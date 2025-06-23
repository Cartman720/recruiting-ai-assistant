-- CreateTable
CREATE TABLE "checkpoint_migrations" (
    "v" INTEGER NOT NULL,

    CONSTRAINT "checkpoint_migrations_pkey" PRIMARY KEY ("v")
);

-- CreateTable
CREATE TABLE "checkpoints" (
    "thread_id" TEXT NOT NULL,
    "checkpoint_ns" TEXT NOT NULL,
    "checkpoint_id" TEXT NOT NULL,
    "parent_checkpoint_id" TEXT,
    "type" TEXT,
    "checkpoint" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "checkpoints_pkey" PRIMARY KEY ("thread_id","checkpoint_ns","checkpoint_id")
);

-- CreateTable
CREATE TABLE "checkpoint_blobs" (
    "thread_id" TEXT NOT NULL,
    "checkpoint_ns" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "blob" BYTEA NOT NULL,

    CONSTRAINT "checkpoint_blobs_pkey" PRIMARY KEY ("thread_id","checkpoint_ns","channel","version")
);

-- CreateTable
CREATE TABLE "checkpoint_writes" (
    "thread_id" TEXT NOT NULL,
    "checkpoint_ns" TEXT NOT NULL,
    "checkpoint_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "idx" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "blob" BYTEA NOT NULL,

    CONSTRAINT "checkpoint_writes_pkey" PRIMARY KEY ("thread_id","checkpoint_ns","checkpoint_id","task_id","idx")
);
