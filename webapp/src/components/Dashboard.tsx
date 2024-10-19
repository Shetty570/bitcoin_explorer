"use client";
import React from "react";
import useSWR from "swr";
import { PriceHistoryGraph } from "@/components/PriceHistoryGraph";
import { BlockList } from "@/components/BlockList";
import { MarketInfo } from "@/components/MarketInfo";
import Nav from "./Nav";

// Type definitions remain the same
type MarketData = {
  price: number;
  marketCap: number;
  volume: number;
  circulatingSupply: number;
  high24h: number;
  low24h: number;
  priceChange1h: number;
  priceChange24h: number;
  maxSupply: number;
};

type Block = {
  block_height: number;
  block_hash: string;
  block_time: string;
  num_transactions: number;
  Transaction: Transaction[];
};

type Transaction = {
  tx_id: string;
  num_inputs: number;
  num_outputs: number;
};

export default function Dashboard() {
  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
      }
      return res.json();
    });

  // Fetch data using SWR
  const {
    data: priceData,
    error: priceError,
    isLoading: priceLoading,
  } = useSWR("/api/priceHistory", fetcher, { refreshInterval: 180000 });
  const {
    data: marketData,
    error: marketError,
    isLoading: marketLoading,
  } = useSWR<MarketData>("/api/marketInfo", fetcher, {
    refreshInterval: 180000,
  });
  const {
    data: blocksData,
    error: blockError,
    isLoading: blockLoading,
  } = useSWR<Block[]>("/api/blocks", fetcher, { refreshInterval: 180000 });

  const isLoading = priceLoading || marketLoading || blockLoading;
  const error = priceError || marketError || blockError;

  const blockData = !blocksData
    ? []
    : blocksData.map((block: Block) => {
        // Parse the block time as a UTC date
        const utcDate = new Date(block.block_time);

        return {
          height: block.block_height,
          hash: block.block_hash,
          time: utcDate.toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          transactions: block.num_transactions,
          transactionDetails: block.Transaction.map((tx: Transaction) => ({
            tx_id: tx.tx_id,
            num_inputs: tx.num_inputs,
            num_outputs: tx.num_outputs,
          })),
        };
      });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data: {error.message}</p>;

  return (
    <>
      <Nav />
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 max-w-full mx-auto">
        {/* Price History Graph */}
        <p className="text-white font-bold text-2xl mb-2">Price History</p>
        <PriceHistoryGraph data={priceData} />

        {/* Block List */}
        <h2 className="text-2xl font-bold mt-1 mb-4">Blockchain</h2>
        <BlockList blocks={blockData} />

        {/* Market Info */}
        <h2 className="text-2xl font-bold mt-6 mb-2">Market Info</h2>
        {marketData && <MarketInfo marketData={marketData} />}
      </div>
    </>
  );
}
