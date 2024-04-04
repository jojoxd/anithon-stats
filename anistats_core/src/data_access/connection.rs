use std::sync::Arc;

use anyhow::anyhow;
use diesel::{
    r2d2::{ConnectionManager, Pool},
    PgConnection
};

use diesel_tracing::pg::InstrumentedPgConnection;

use anistats_common::config::database::DatabaseConfig;

pub type DbPool = Pool<ConnectionManager<InstrumentedPgConnection>>;

pub fn create_db_pool(database_config: Arc<DatabaseConfig>) -> anyhow::Result<DbPool> {
    let dsn = match std::env::var("DATABASE_DSN") {
        Ok(env_dsn) => env_dsn,
        Err(_) => match database_config.dsn.clone() {
            Some(cfg_dsn) => cfg_dsn,
            None => panic!("No database dsn found"),
        },
    };

    // Maybe support different dbs in the future?
    if ! dsn.starts_with("postgres://") {
        return Err(anyhow!("The database dsn is not a postgres DSN"));
    }

    let manager = ConnectionManager::<InstrumentedPgConnection>::new(dsn);

    let pool = Pool::builder()
        .build(manager)
        .unwrap();

    Ok(pool)
}
