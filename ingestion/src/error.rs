use thiserror::Error;

#[derive(Error, Debug)]
pub enum IngestionError {
    #[error("Bitcoin RPC error")]
    BitcoinRpcError(#[from] bitcoincore_rpc::Error),
    
    #[error("Reqwest HTTP error")]
    ReqwestError(#[from] reqwest::Error),
    
    #[error("PostgreSQL error")]
    PostgresError(#[from] tokio_postgres::Error),

    #[error("Environment variable error")]
    EnvVarError(#[from] std::env::VarError),
}
