use std::error::Error;

use diesel_migrations::{EmbeddedMigrations, MigrationHarness};

const MIGRATIONS: EmbeddedMigrations = diesel_migrations::embed_migrations!();

pub fn migrate(connection: &mut impl MigrationHarness<diesel::pg::Pg>) -> Result<(), Box<dyn Error + Send + Sync + 'static>> {
    while connection.has_pending_migration(MIGRATIONS)? {
        let pending = connection.pending_migrations(MIGRATIONS)?;
        let migration = pending.get(0).ok_or(anyhow::anyhow!("Failed to get pending migration"))?;

        tracing::info!("Running migration: {}", migration.name());

        match connection.run_next_migration(MIGRATIONS) {
            Ok(_) => {
                tracing::info!("Migration {} succeeded", migration.name());
            },

            Err(err) => {
                tracing::error!("{}", err.to_string());

                return Err(err);
            },
        };
    }

    Ok(())
}
