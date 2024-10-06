use bitcoincore_rpc::{Auth, Client, RpcApi};
use tokio_postgres::NoTls;
use crate::error::IngestionError;
use std::convert::TryInto;

// Function to fetch the latest block height
pub async fn get_latest_block_height() -> Result<i64, IngestionError> {
    let rpc_url = std::env::var("RPC_URL")?;
    let rpc_user = std::env::var("RPC_USER")?;
    let rpc_pass = std::env::var("RPC_PASSWORD")?;

    let client = Client::new(
        &rpc_url,
        Auth::UserPass(rpc_user, rpc_pass)
    )?;

    // Fetch and return the latest block height as i64 by converting u64 to i64
    Ok(client.get_block_count()?.try_into().unwrap())
}

// Ingest new block and the latest 10 transactions
pub async fn ingest_onchain_data(latest_block_height: i64) -> Result<(), IngestionError> {
    // Fetch block details using the block height
    let rpc_url = std::env::var("RPC_URL")?;
    let rpc_user = std::env::var("RPC_USER")?;
    let rpc_pass = std::env::var("RPC_PASSWORD")?;

    let client = Client::new(
        &rpc_url,
        Auth::UserPass(rpc_user, rpc_pass)
    )?;

    // Convert i64 block height to u64 when passing to get_block_hash
    let block_hash = client.get_block_hash(latest_block_height.try_into().unwrap())?;
    let block = client.get_block(&block_hash)?;

    // Use the raw Unix timestamp from the block header and cast to f64
    let block_time = block.header.time as f64;
    let num_transactions = block.txdata.len();

    // Insert block data into OnChainData table
    let (pg_client, connection) = tokio_postgres::connect(&std::env::var("POSTGRES_URL")?, NoTls).await?;
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Database connection error: {}", e);
        }
    });

    // Insert the block data using ON CONFLICT to handle duplicates
    pg_client
        .execute(
            r#"INSERT INTO "OnChainData" (block_height, block_hash, block_time, num_transactions) 
               VALUES ($1, $2, TO_TIMESTAMP($3), $4) 
               ON CONFLICT (block_hash) DO NOTHING"#,  // Ignore if block_hash already exists
            &[&(latest_block_height as i32), &block_hash.to_string(), &block_time, &(num_transactions as i32)]  // Cast block_time to f64
        )
        .await?;

    println!("Block ingested successfully. Ingesting latest 10 transactions...");

    // Insert the latest 10 transactions
    for transaction in block.txdata.iter().take(10) {  // Limit to the latest 10 transactions
        let tx_id = transaction.txid().to_string();
        let num_inputs = transaction.input.len() as i32;
        let num_outputs = transaction.output.len() as i32;

        // Insert or update the transaction data using ON CONFLICT to update if needed
        pg_client
            .execute(
                r#"INSERT INTO "Transaction" (tx_id, block_hash, num_inputs, num_outputs) 
                   VALUES ($1, $2, $3, $4) 
                   ON CONFLICT (tx_id) DO NOTHING"#,  // Avoid duplicates
                &[&tx_id, &block_hash.to_string(), &num_inputs, &num_outputs]
            )
            .await?;
    }

    println!("Successfully ingested 10 transactions for block height: {}", latest_block_height);
    Ok(())
}
