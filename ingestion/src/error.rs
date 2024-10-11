use thiserror::Error;
use bb8::RunError;
use tokio_postgres::Error as PostgresError;

#[derive(Error, Debug)]
pub enum IngestionError {
    #[error("Bitcoin RPC error")]
    BitcoinRpcError(#[from] bitcoincore_rpc::Error),
    
    #[error("Reqwest HTTP error")]
    ReqwestError(#[from] reqwest::Error),
    
    #[error("PostgreSQL error")]
    PostgresError(#[from] tokio_postgres::Error),

    #[error("Postgres pool error")]
    PoolError(#[from] RunError<PostgresError>), // Added handling for bb8 RunError

    #[error("Environment variable error")]
    EnvVarError(#[from] std::env::VarError),
}
