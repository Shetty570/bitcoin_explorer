mod error;
mod onchain;
mod offchain;

use dotenv::dotenv;
use tokio::time::{sleep, Duration};
use crate::error::IngestionError;

#[tokio::main]
async fn main() -> Result<(), IngestionError> {
    dotenv().ok();  // Load environment variables from .env
    
    let mut last_ingested_block_height: i64 = -1;  // Variable to store the last ingested block height

    loop {
        // Fetch the latest block height from the Bitcoin node
        let latest_block_height = onchain::get_latest_block_height().await?;
        
        // Check if a new block has been mined
        if latest_block_height > last_ingested_block_height {
            // Ingest the new block
            println!("New block detected: {}", latest_block_height);
            
            let (onchain_res, offchain_res) = tokio::join!(
                onchain::ingest_onchain_data(latest_block_height),
                offchain::ingest_offchain_data()  // Fetch and ingest off-chain data
            );

            if let Err(e) = onchain_res {
                eprintln!("On-chain ingestion failed: {:?}", e);
            }

            if let Err(e) = offchain_res {
                eprintln!("Off-chain ingestion failed: {:?}", e);
            }

            // Update the last ingested block height
            last_ingested_block_height = latest_block_height;
        } else {
            println!("No new block detected, waiting...");
        }

        // Sleep for a while before checking again (adjust the duration based on your needs)
        sleep(Duration::from_secs(60)).await;  // e.g., check every minute
    }
}
