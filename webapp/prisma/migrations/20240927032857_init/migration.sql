-- CreateTable
CREATE TABLE "BlockHeights" (
    "id" SERIAL NOT NULL,
    "block_height" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockHeights_pkey" PRIMARY KEY ("id")
);
