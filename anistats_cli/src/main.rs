mod cli;
mod command;
mod commands;

use std::path::PathBuf;

use anistats_common::config::{server::ServerConfig, database::DatabaseConfig};
use anyhow::{anyhow, Ok};
use dotenvy::dotenv;
use clap::Parser;

use clap_serde_derive::ClapSerde;

use crate::command::Command;
use crate::cli::Cli;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv()?;

    let cli = Cli::parse();
    // let config = Config::parse(cli.config.as_ref().unwrap())?;

    tracing_subscriber::fmt()
        .with_max_level(cli.tracing_level())
        .init();

    tracing::info!("log level = {}", cli.tracing_level());

    match cli.command {
        Some(Command::Serve { mut server, mut database }) => {
            let server_config = parse_server_config(cli.config.clone(), &mut server);
            let database_config = parse_database_config(cli.config.clone(), &mut database);

            commands::serve::serve(server_config, database_config).await?;

            Ok(())
        },

        Some(Command::Migrate { mut database }) => {
            let database_config = parse_database_config(cli.config.clone(), &mut database);

            commands::migrate::migrate(database_config).await?;

            Ok(())
        },

        Some(Command::Ui { mut database }) => {
            tracing::error!("UI Not implemented yet");

            Ok(())
        },

        None => {
            println!("NO COMMAND GIVEN");

            Err(anyhow!("TODO: FIX ERROR HANDLING"))
        },
    }
}

fn parse_server_config(config: PathBuf, clap_serde: &mut <ServerConfig as ClapSerde>::Opt) -> ServerConfig {
    ServerConfig::parse_config(config)
        .unwrap()
        .merge(clap_serde)
}

fn parse_database_config(config: PathBuf, clap_serde: &mut <DatabaseConfig as ClapSerde>::Opt) -> DatabaseConfig {
    DatabaseConfig::parse_config(config)
        .unwrap()
        .merge(clap_serde)
}
