-- CreateTable
CREATE TABLE "OnChainData" (
    "id" SERIAL NOT NULL,
    "block_hash" TEXT NOT NULL,
    "block_height" INTEGER NOT NULL,
    "block_time" TIMESTAMP(3) NOT NULL,
    "num_transactions" INTEGER NOT NULL,

    CONSTRAINT "OnChainData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffChainData" (
    "id" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "market_cap" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "circulating_supply" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OffChainData_pkey" PRIMARY KEY ("id")
);
