import * as React from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";

// Define props for block data, renamed to BlockData to avoid conflicts
type BlockData = {
  height: number;
  hash: string;
  time: string;
  transactions: number;
  transactionDetails: Transaction[];
};

type Transaction = {
  tx_id: string;
  num_inputs: number;
  num_outputs: number;
};

type BlockListProps = {
  blocks: BlockData[]; // Use the renamed type
};

export function BlockList({ blocks }: BlockListProps) {
  const [selectedBlock, setSelectedBlock] = React.useState<BlockData | null>(
    null
  );

  React.useEffect(() => {
    if (selectedBlock) {
      console.log("Selected Block:", selectedBlock);
    }
  }, [selectedBlock]);

  return (
    <div>
      {/* Render the list of blocks */}
      <div className="flex flex-row gap-6 items-center my-auto">
        {blocks.map((block) => (
          <div
            key={block.height}
            onClick={() => setSelectedBlock(block)}
            className="
            cursor-pointer w-full 
            sm:w-36
            lg:w-40
            aspect-square
            text-white flex justify-center items-center 
            bg-gradient-to-br from-indigo-900 via-gray-800 to-black 
            rounded-lg shadow-lg border border-gray-500 
            hover:bg-gradient-to-br hover:from-black hover:via-gray-700 hover:to-indigo-900
            transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">{block.height}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Single Drawer Component */}
      <Drawer
        open={selectedBlock !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBlock(null);
          }
        }}
      >
        <DrawerContent className="h-2/3">
          {selectedBlock && (
            <>
              <DrawerTitle className="text-black text-4xl  text-center px-6 mx-auto py-3 tracking-wide">
                Block #{selectedBlock.height}
              </DrawerTitle>
              <div className="p-6 mx-auto my-auto items-center">
                <div className="flex flex-row ">
                  {/* Block Details */}
                  <div className="flex flex-col ">
                    <p className="text-black text-3xl font-bold text-center pb-2">
                      Block Details
                    </p>
                    <p className="text-black m-3">
                      <span className="text-xl font-bold mb-2">
                        Block Hash :
                      </span>
                      <br /> {selectedBlock.hash}
                    </p>
                    <p className="text-black m-3">
                      <span className="text-xl font-bold mb-2">
                        Block Height :
                      </span>
                      <br /> {selectedBlock.height}
                    </p>
                    <p className="text-black m-3">
                      <span className="text-xl font-bold mb-2">Mined On :</span>
                      <br /> {selectedBlock.time}
                    </p>
                    <p className="text-black m-3">
                      <span className="text-xl font-bold mb-2">
                        Total Transactions in the Block:
                      </span>
                      <br /> {selectedBlock.transactions}
                    </p>
                  </div>

                  {/* Transaction Details */}
                  <div className="ml-8">
                    <p className="text-black text-3xl font-bold text-center pb-2">
                      {" "}
                      Transactions
                    </p>
                    <table className="min-w-full text-left text-sm text-gray-500">
                      <thead className="bg-gray-200 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 text-xl">Transaction ID</th>
                          <th className="py-2 px-4 text-xl">Inputs</th>
                          <th className="py-2 px-4 text-xl">Outputs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBlock.transactionDetails.map((tx, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 px-4 text-black ">
                              {tx.tx_id}
                            </td>
                            <td className="py-2 px-4 text-black text-center">
                              {tx.num_inputs}
                            </td>
                            <td className="py-2 px-4 text-black text-center">
                              {tx.num_outputs}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
