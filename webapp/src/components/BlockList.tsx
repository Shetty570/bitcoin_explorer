"use client";
import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define props for block data
type Block = {
  height: number;
  hash: string;
  time: string;
  transactions: number;
};

type BlockListProps = {
  blocks: Block[];
};

export function BlockList({ blocks }: BlockListProps) {
  const [selectedBlock, setSelectedBlock] = React.useState<Block | null>(null);

  return (
    <div className="flex flex-row gap-5 ">
      {blocks.map((block) => (
        <Drawer key={block.height}>
          <DrawerTrigger asChild>
            <Card
              onClick={() => setSelectedBlock(block)}
              className="cursor-pointer w-40 h-40 flex justify-center items-center"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold">{block.height}</h2>
              </div>
            </Card>
          </DrawerTrigger>

          <DrawerContent className="h-2/3">
            {selectedBlock && (
              <div className="p-6">
                <h2 className="text-2xl font-bold">
                  Block #{selectedBlock.height}
                </h2>
                <p>Hash: {selectedBlock.hash}</p>
                <p>Time: {selectedBlock.time}</p>
                <p>Transactions: {selectedBlock.transactions}</p>
                {/* Add more block data here */}
              </div>
            )}
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
