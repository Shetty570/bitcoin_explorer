/*
  Warnings:

  - A unique constraint covering the columns `[block_hash]` on the table `OnChainData` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "tx_id" TEXT NOT NULL,
    "block_hash" TEXT NOT NULL,
    "num_inputs" INTEGER NOT NULL,
    "num_outputs" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_tx_id_key" ON "Transaction"("tx_id");

-- CreateIndex
CREATE INDEX "Transaction_block_hash_idx" ON "Transaction"("block_hash");

-- CreateIndex
CREATE UNIQUE INDEX "OnChainData_block_hash_key" ON "OnChainData"("block_hash");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_block_hash_fkey" FOREIGN KEY ("block_hash") REFERENCES "OnChainData"("block_hash") ON DELETE RESTRICT ON UPDATE CASCADE;
