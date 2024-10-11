"use client";

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

export function MarketInfo({ marketData }: { marketData: MarketData }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div>
        <p className="text-lg font-bold">Current Price</p>
        <p>${marketData.price.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-lg font-bold">Market Cap</p>
        <p>${marketData.marketCap.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-lg font-bold">Volume (24h)</p>
        <p>${marketData.volume.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-lg font-bold">Circulating Supply</p>
        <p>{marketData.circulatingSupply.toLocaleString()} BTC</p>
      </div>
      <div>
        <p className="text-lg font-bold">24h High</p>
        <p>${marketData.high24h.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-lg font-bold">24h Low</p>
        <p>${marketData.low24h.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-lg font-bold">1h Change</p>
        <p>
          {marketData.priceChange1h > 0 ? "+" : ""}
          {marketData.priceChange1h.toFixed(2)}%
        </p>
      </div>
      <div>
        <p className="text-lg font-bold">24h Change</p>
        <p>
          {marketData.priceChange24h > 0 ? "+" : ""}
          {marketData.priceChange24h.toFixed(2)}%
        </p>
      </div>
      <div>
        <p className="text-lg font-bold">Max Supply</p>
        <p>{marketData.maxSupply.toLocaleString()} BTC</p>
      </div>
    </div>
  );
}
