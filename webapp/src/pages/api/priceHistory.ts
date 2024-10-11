// src/pages/api/priceHistory.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type PriceEntry = {
  timestamp: Date;
  price: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const priceHistory = await prisma.offChainData.findMany({
      select: {
        timestamp: true,
        price: true,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
    });

    const formattedData = priceHistory.map((entry: PriceEntry) => ({
      time: entry.timestamp.toISOString(),
      price: entry.price,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
