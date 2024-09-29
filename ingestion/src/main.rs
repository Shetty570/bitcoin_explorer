use bitcoincore_rpc::{Auth, Client, RpcApi};
use tokio_postgres::{NoTls};
use tokio::time::{sleep, Duration};
use dotenv::dotenv;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables
    dotenv().ok();

    // Connect to PostgreSQL database
    let postgres_url = env::var("POSTGRES_URL").expect("POSTGRES_URL must be set");
    let (client, connection) = tokio_postgres::connect(&postgres_url, NoTls).await?;

    // Spawn the connection in a background task
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Postgres connection error: {}", e);
        }
    });

    // Set up Bitcoin Core RPC client
    let rpc_url = env::var("RPC_URL").expect("RPC_URL must be set");
    let rpc_user = env::var("RPC_USER").expect("RPC_USER must be set");
    let rpc_password = env::var("RPC_PASSWORD").expect("RPC_PASSWORD must be set");

    let rpc_auth = Auth::UserPass(rpc_user, rpc_password);
    let bitcoin_client = Client::new(&rpc_url, rpc_auth)?;

    // Variable to store the last block height fetched
    let mut last_block_height = 0;

    loop {
        // Fetch latest block height from Bitcoin Core
        let block_height = bitcoin_client.get_block_count()?;
        println!("Fetched Block Height: {}", block_height);

        // Check if the block height has changed
        if block_height != last_block_height {
            // Insert block height into PostgreSQL using correct case for table name
            let query = "INSERT INTO \"BlockHeights\" (block_height) VALUES ($1)";
            let result = client.execute(query, &[&(block_height as i64)]).await;

            match result {
                Ok(_) => {
                    println!("Inserted new block height into database.");
                    // Update the last block height after successful insertion
                    last_block_height = block_height;
                }
                Err(e) => {
                    eprintln!("Error inserting block height: {}", e);
                }
            }
        } else {
            println!("Block height has not changed, skipping insertion.");
        }

        // Wait for 10 seconds before fetching the next block height
        sleep(Duration::from_secs(10)).await;
    }
}
