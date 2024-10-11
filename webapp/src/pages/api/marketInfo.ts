import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const latestData = await prisma.offChainData.findFirst({
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!latestData) {
      return res.status(404).json({ message: "No off-chain data available" });
    }

    const marketData = {
      price: latestData.price,
      marketCap: latestData.market_cap,
      volume: latestData.volume,
      circulatingSupply: latestData.circulating_supply,
      high24h: latestData.high_24h,
      low24h: latestData.low_24h,
      priceChange1h: latestData.price_change_1h,
      priceChange24h: latestData.price_change_24h,
      maxSupply: 21000000, // max supply is constant for Bitcoin
    };

    res.status(200).json(marketData);
  } catch (error) {
    console.error("Error fetching off-chain data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
