type MarketData = {
  price: number;
  marketCap: number;
  volume: number;
  circulatingSupply: number;
  maxSupply: number;
};

type MarketInfoProps = {
  marketData: MarketData;
};

export function MarketInfo({ marketData }: MarketInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <h3 className="text-lg font-bold">Price</h3>
        <p>${marketData.price.toFixed(2)}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold">Market Cap</h3>
        <p>${marketData.marketCap.toLocaleString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold">Volume (24h)</h3>
        <p>${marketData.volume.toLocaleString()}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold">Circulating Supply</h3>
        <p>{marketData.circulatingSupply.toLocaleString()} BTC</p>
      </div>
      <div>
        <h3 className="text-lg font-bold">Max Supply</h3>
        <p>{marketData.maxSupply.toLocaleString()} BTC</p>
      </div>
    </div>
  );
}
