import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const latestBlock = await prisma.blockHeights.findFirst({
            orderBy: { id: 'desc' },
        });

        if (latestBlock) {
            res.status(200).json({ block_height: latestBlock.block_height.toString() });
        } else {
            console.error("No block heights found");
            res.status(404).json({ message: 'No block height found' });
        }
    } catch (error) {
        console.error("Error fetching block height:", error);  // Log the exact error
        res.status(500).json({ message: 'Error fetching block height', error });
    }
}
