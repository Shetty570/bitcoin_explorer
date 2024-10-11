import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Fetch the latest 10 blocks from the OnChainData table
    const blocks = await prisma.onChainData.findMany({
      orderBy: {
        block_height: "desc",
      },
      take: 10,
      select: {
        block_height: true,
        block_hash: true,
        block_time: true,
        num_transactions: true,
        Transaction: true,
      },
    });

    if (blocks.length === 0) {
      return res.status(204).json({ message: "No blocks found" });
    }

    res.status(200).json(blocks);
  } catch (error) {
    console.error("Error fetching block data:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
