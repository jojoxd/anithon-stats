use anistats_common::config::{database::DatabaseConfig, server::ServerConfig};

pub async fn serve(server_config: ServerConfig, database_config: DatabaseConfig) -> anyhow::Result<()> {
    anistats_core::serve(
        server_config,
        database_config,
    ).await?;

    Ok(())
}
