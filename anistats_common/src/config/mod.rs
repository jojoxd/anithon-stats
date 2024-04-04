pub mod server;
pub mod database;

use crate::config::database::DatabaseConfig;
use crate::config::server::ServerConfig;

use clap_serde_derive::{clap::{self}, ClapSerde};
use serde::Deserialize;

// use std::{fs::File, io::Read as _, path::PathBuf};

#[derive(Deserialize, ClapSerde)]
pub struct Config {
    #[clap(flatten)]
    pub database: <DatabaseConfig as ClapSerde>::Opt,

    #[clap(flatten)]
    pub server:   <ServerConfig as ClapSerde>::Opt,
}
