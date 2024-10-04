"use client";
import * as React from "react";
import { PriceHistoryGraph } from "@/components/PriceHistoryGraph";
import { BlockList } from "@/components/BlockList";
import { MarketInfo } from "@/components/MarketInfo";
import Nav from "./Nav";

const mockBlockData = [
  {
    height: 863740,
    hash: "00000000000000000",
    time: "12:30 PM",
    transactions: 1500,
  },
  {
    height: 863739,
    hash: "00000000000000001",
    time: "12:10 PM",
    transactions: 1200,
  },
  // more block data here...
];

const mockPriceData = [
  { time: "12:00", price: 61729.78 },
  { time: "12:15", price: 61800.12 },
  // more price data here...
];

const mockMarketData = {
  price: 61729.78,
  marketCap: 1220523145747,
  volume: 53446378184,
  circulatingSupply: 19761668,
  maxSupply: 21000000,
};

export default function Dashboard() {
  return (
    <>
      <Nav />
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 max-w-full mx-auto">
        {/* Price History Graph */}
        <p className="text-white font-bold text-2xl mb-2">Price History</p>
        <PriceHistoryGraph data={mockPriceData} />

        {/* Block List */}
        <h2 className="text-2xl font-bold mt-8 mb-2">Blockchain</h2>
        <BlockList blocks={mockBlockData} />

        {/* Market Info */}
        <h2 className="text-2xl font-bold mt-8">Market Info</h2>
        <MarketInfo marketData={mockMarketData} />
      </div>
    </>
  );
}
