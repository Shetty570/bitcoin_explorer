mod error;
mod onchain;
mod offchain;

use dotenv::dotenv;
use tokio::time::{sleep, Duration, Instant};
use crate::error::IngestionError;
use bb8::{Pool};
use bb8_postgres::PostgresConnectionManager;
use tokio_postgres::NoTls;

#[tokio::main]
async fn main() -> Result<(), IngestionError> {
    dotenv().ok();

    // Set up the Postgres connection pool
    let manager = PostgresConnectionManager::new_from_stringlike(
        &std::env::var("POSTGRES_URL")?,
        NoTls,
    )?;
    let pool = Pool::builder()
        .max_size(10)  // Adjust pool size based on your needs
        .build(manager)
        .await?;

    let mut last_ingested_block_height: i64 = -1;
    let mut last_offchain_ingestion = Instant::now();
    let mut last_onchain_ingestion = Instant::now();

    loop {
        let now = Instant::now();

        // Off-chain ingestion every 60 seconds
        if now.duration_since(last_offchain_ingestion) >= Duration::from_secs(60) {
            let pool_clone = pool.clone();  // Clone the pool for off-chain task
            if let Err(e) = offchain::ingest_offchain_data(pool_clone).await {
                eprintln!("Off-chain ingestion failed: {:?}", e);
            } else {
                println!("Successfully ingested off-chain data.");
                last_offchain_ingestion = Instant::now();
            }
        }

        // On-chain ingestion every 4 minutes or when a new block is detected
        if now.duration_since(last_onchain_ingestion) >= Duration::from_secs(4 * 60) {
            let latest_block_height = onchain::get_latest_block_height().await?;

            if latest_block_height > last_ingested_block_height {
                println!("New block detected: {}", latest_block_height);
                let pool_clone = pool.clone();  // Clone the pool for on-chain task

                if let Err(e) = onchain::ingest_onchain_data(latest_block_height, pool_clone).await {

                    eprintln!("On-chain ingestion failed: {:?}", e);
                } else {
                    println!("Successfully ingested on-chain data for block: {}", latest_block_height);
                    last_ingested_block_height = latest_block_height;
                }

                last_onchain_ingestion = now;
            }
        }

        // Sleep briefly to avoid tight loops
        sleep(Duration::from_secs(1)).await;
    }
}
