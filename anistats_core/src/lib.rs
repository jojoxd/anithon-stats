mod data_access;
mod models;
mod schema;

use std::sync::Arc;

use anistats_common::config::{server::ServerConfig, database::DatabaseConfig};

use crate::{data_access::{connection::{create_db_pool, DbPool}, repository::media_repository::MediaRepository}};

pub fn migrate(database_config: DatabaseConfig) -> anyhow::Result<()> {
    let db_pool: DbPool = create_db_pool(Arc::new(database_config))?;
    let mut connection = match db_pool.get() {
        Ok(conn) => conn,
        Err(err) => panic!("{:?}", err),
    };

    match data_access::migrations::migrate(&mut connection) {
        Ok(_) => Ok(()),
        Err(err) => panic!("{:?}", err),
    }
}
