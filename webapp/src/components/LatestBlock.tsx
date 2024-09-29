import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

// Define the prop type for LatestBlock
type LatestBlockProps = {
  latestBlock: string | number; // Adjust based on whether it's a number or string from the API
};

export function LatestBlock({ latestBlock }: LatestBlockProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="text-black " variant="outline">
          Click for the latest Block Height
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" bg-black h-2/3">
        <div className="mx-auto w-full max-w-sm  mt-20 flex justify-center items-center">
          <div className="w-32 h-32 border-4 border-gray-800 bg-white rounded-lg flex justify-center items-center">
            <div className="text-3xl font-bold text-center">{latestBlock}</div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
