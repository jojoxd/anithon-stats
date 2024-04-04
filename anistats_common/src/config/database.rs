use std::path::PathBuf;
use std::fs::File;
use std::io::Read;

use clap_serde_derive::{clap::{self, arg}, ClapSerde};
use serde::Deserialize;
use super::Config;

#[derive(Debug, Deserialize, ClapSerde)]
pub struct DatabaseConfig {
    /// Database connection string
    #[arg(
        long = "database-dsn",
    )]
    pub dsn: Option<String>,
}

impl DatabaseConfig {
    pub fn parse_config(path: PathBuf) -> anyhow::Result<Self> {
        if let Ok(mut file) = File::open(path) {
            let mut contents = String::new();
            if let Ok(_) = file.read_to_string(&mut contents) {
                match toml::from_str::<Config>(contents.as_str()) {
                    Ok(config) => return Ok(config.database.into()),
                    Err(err)   => panic!("{}", err),
                }
            }
        }

        Ok(
            DatabaseConfig::default()
        )
    }
}
