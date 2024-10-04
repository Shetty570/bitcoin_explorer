"use client";

// import useSWR from "swr";

// import { LatestBlock } from "@/components/LatestBlock";

// const fetcher = async (url: string) => {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch");
//   }
//   return response.json();
// };

// export default function Home() {
//   const { data, error } = useSWR("/api/blockHeight", fetcher, {
//     refreshInterval: 10000,
//   });
//   if (error)
//     return (
//       <div className="min-h-screen flex justify-center items-center text-white">
//         {" "}
//         Failed to load block height
//       </div>
//     );
//   if (!data)
//     return (
//       <div className="min-h-screen flex justify-center items-center text-white">
//         Loading.........
//       </div>
//     );
//   return (
//     <div className="text-center min-h-screen bg-black flex flex-col justify-center items-center text-white">
//       <h1 className="text-3xl py-10 font-bold">Bitcoin Explorer</h1>
//       {/* <p className="text-3xl">Current Block Height: {data.block_height}</p> */}
//       <LatestBlock latestBlock={data.block_height} />
//     </div>
//   );
// }

import * as React from "react";
import Dashboard from "@/components/Dashboard"; // Import the Dashboard component

export default function Home() {
  return (
    <div>
      <Dashboard /> {/* Render the Dashboard component */}
    </div>
  );
}
