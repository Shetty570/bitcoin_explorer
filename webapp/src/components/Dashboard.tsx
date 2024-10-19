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
  const fetcher = async (url: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // Timeout after 10 seconds

    try {
      const res = await fetch(url, { signal: controller.signal });

      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Failed to fetch ${url}: ${res.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage += ` - ${errorData.message}`;
        } catch (e) {
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      return res.json();
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error(`Request to ${url} timed out.`);
      }
      throw error;
    }
  };

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

  // Process blocks data if available
  const blockData = blocksData
    ? blocksData.map((block: Block) => {
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
      })
    : [];

  return (
    <>
      <Nav />
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 max-w-full mx-auto">
        {/* Price History Graph */}
        <p className="text-white font-bold text-2xl mb-2">Price History</p>
        {priceLoading ? (
          <p>Loading price data...</p>
        ) : priceError ? (
          <p>Error loading price data: {priceError.message}</p>
        ) : (
          priceData && <PriceHistoryGraph data={priceData} />
        )}

        {/* Block List */}
        <h2 className="text-2xl font-bold mt-1 mb-4">Blockchain</h2>
        {blockLoading ? (
          <p>Loading blocks...</p>
        ) : blockError ? (
          <p>Error loading blocks: {blockError.message}</p>
        ) : blocksData && blocksData.length > 0 ? (
          <BlockList blocks={blockData} />
        ) : (
          <p>No block data available.</p>
        )}

        {/* Market Info */}
        <h2 className="text-2xl font-bold mt-6 mb-2">Market Info</h2>
        {marketLoading ? (
          <p>Loading market data...</p>
        ) : marketError ? (
          <p>Error loading market data: {marketError.message}</p>
        ) : (
          marketData && <MarketInfo marketData={marketData} />
        )}
      </div>
    </>
  );
}
