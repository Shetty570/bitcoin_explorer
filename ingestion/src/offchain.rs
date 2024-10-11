use reqwest::Error as ReqwestError;
use crate::error::IngestionError;
use bb8::Pool;
use bb8_postgres::PostgresConnectionManager;
use tokio_postgres::NoTls;
// use std::convert::TryInto;
use std::env;

// Struct to map the CoinGecko detailed response
#[derive(serde::Deserialize)]
struct CoinGeckoResponse {
    market_data: MarketData,
}

#[derive(serde::Deserialize)]
struct MarketData {
    current_price: Prices,
    market_cap: Prices,
    total_volume: Prices,
    circulating_supply: f64,
    price_change_percentage_24h: f64,
    price_change_percentage_1h_in_currency: Prices,
    high_24h: Prices,
    low_24h: Prices,
}

#[derive(serde::Deserialize)]
struct Prices {
    usd: f64,
}

// Fetch and insert off-chain data into the OffChainData table
pub async fn ingest_offchain_data(pool: Pool<PostgresConnectionManager<NoTls>>) -> Result<(), IngestionError> {
    let market_data = fetch_offchain_data().await?;
    let client = pool.get().await?;

    // Insert the off-chain data into the table
    client
        .execute(
            r#"INSERT INTO "OffChainData" 
            (price, market_cap, volume, circulating_supply, price_change_24h, price_change_1h, high_24h, low_24h) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"#,
            &[
                &market_data.current_price.usd,
                &market_data.market_cap.usd,
                &market_data.total_volume.usd,
                &market_data.circulating_supply,
                &market_data.price_change_percentage_24h,
                &market_data.price_change_percentage_1h_in_currency.usd,
                &market_data.high_24h.usd,
                &market_data.low_24h.usd,
            ]
        )
        .await?;

    println!("Successfully ingested off-chain data.");
    Ok(())
}

// Fetch detailed price and market data from CoinGecko
async fn fetch_offchain_data() -> Result<MarketData, ReqwestError> {
    // Fetch the CoinGecko URL from environment variable at runtime
    let coingecko_url = env::var("COINGECKO_URL").expect("COINGECKO_URL must be set");

    // Make the API request using the fetched URL
    let response = reqwest::get(&coingecko_url).await?
        .json::<CoinGeckoResponse>()
        .await?;

    Ok(response.market_data)
}
