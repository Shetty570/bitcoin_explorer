use reqwest::Error as ReqwestError;
use crate::error::IngestionError;
use tokio_postgres::NoTls;

// Define the URL for the CoinGecko API
const COINGECKO_URL: &str = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_circulating_supply=true";

// Struct to match the CoinGecko response
#[derive(serde::Deserialize)]
struct CoinGeckoResponse {
    bitcoin: PriceData,
}

#[derive(serde::Deserialize)]
struct PriceData {
    usd: f64,
    usd_market_cap: Option<f64>,           // Make these fields optional
    usd_24h_vol: Option<f64>,
    usd_circulating_supply: Option<f64>,
}

// Fetch off-chain data from CoinGecko API
pub async fn ingest_offchain_data() -> Result<(), IngestionError> {
    let price_data = fetch_offchain_data().await?;

    // Insert off-chain data into OffChainData table
    let (pg_client, connection) = tokio_postgres::connect(&std::env::var("POSTGRES_URL")?, NoTls).await?;
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Database connection error: {}", e);
        }
    });

    // Insert off-chain data
    pg_client
        .execute(
            r#"INSERT INTO "OffChainData" (price, market_cap, volume, circulating_supply) 
               VALUES ($1, $2, $3, $4)"#,
            &[
                &price_data.usd,
                &price_data.usd_market_cap.unwrap_or(0.0), // Default to 0.0 if no value
                &price_data.usd_24h_vol.unwrap_or(0.0),   // Default to 0.0 if no value
                &price_data.usd_circulating_supply.unwrap_or(0.0), // Default to 0.0 if no value
            ]
        )
        .await?;

    println!("Successfully ingested off-chain data.");
    Ok(())
}

// Fetch the price and market data from CoinGecko API
async fn fetch_offchain_data() -> Result<PriceData, ReqwestError> {
    let response = reqwest::get(COINGECKO_URL).await?
        .json::<CoinGeckoResponse>()
        .await?;

    Ok(response.bitcoin)
}
