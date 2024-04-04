use anistats_common::config::database::DatabaseConfig;

pub async fn migrate(database_config: DatabaseConfig) -> anyhow::Result<()> {
    anistats_core::migrate(database_config)
}
